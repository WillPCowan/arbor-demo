/**
 * Support code for creation of change streams, exporting the ChangeStream
 * to easily configure and run a change stream on a specified MongoDB
 * collection, with a specified change-event handler.
 *
 */

// IMPORTS --------------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stdout } from "process";
import { getTime } from "../../../back/lib/time.js";
import { createFile, getBackupFilename } from "../../../back/lib/io.js";
import { onExit } from "../../../back/lib/process.js";

// PRIVATE FUNCTIONS ----------------------------------------------------------
// A function to handle exit

// Convert a resumeToken object into a string
function resumeTokenToString(resumeToken) {
  if (resumeToken) return resumeToken._data;
  else return "null";
}

// Convert a string containing an event id into a resumeToken object
function stringToResumeToken(resumeTokenStr) {
  return { _data: resumeTokenStr };
}

// If exists, load (from a file)  the final resumeToken of the previous stream
function loadResumeToken(resumeTokenFilePath) {
  let resumeToken = null;
  if (fs.existsSync(resumeTokenFilePath)) {
    const fileData = fs
      .readFileSync(resumeTokenFilePath, "utf8")
      .toString()
      .split("\n")[0];
    if (fileData) resumeToken = stringToResumeToken(fileData);
  }
  return resumeToken;
}

// Save this streams findal resumeToken to a file, and backup the prior file
function saveResumeToken(resumeToken, resumeTokenFilePath) {
  try {
    const backupPath = getBackupFilename(resumeTokenFilePath);
    // Copy old resume token to backup file and save new one
    // If token is null, end of event stream reached (keep old token) or none
    if (resumeToken) {
      if (fs.existsSync(backupPath))
        fs.copyFileSync(resumeTokenFilePath, backupPath);
      if (!fs.existsSync(resumeTokenFilePath)) {
        // Generate folders and file
        createFile(resumeTokenFilePath);
      }
      fs.writeFileSync(resumeTokenFilePath, resumeTokenToString(resumeToken), {
        flag: "w+",
      });
    }
  } catch (error) {
    console.log("Issue saving resumeToken.");
    console.error(error);
  }
}

// Close change stream after given amount of time
async function closeChangeStream(changeStream, timeInMs = 60000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      changeStream.close();
      resolve();
    }, timeInMs);
  });
}

//
/**
 * Monitor change stream and close after given time, starting from startToken.
 * NOTE: This processes each event asynchronously, e.g. update could happen before creation
 * @param {*} client The MongoDB client being used.
 * @param {*} timeInMs The time before change stream closes.
 * @param {*} pipeline A pipeline to aggregate events (i.e. filter & transform)
 * @param {*} resumeToken The id obj of the change event to start from.
 * @returns
 */
async function monitorEvents(
  mongoCol,
  timeInMs = 600000,
  pipeline = [],
  resumeToken = null,
  eventHandler = (event) => console.log(event)
) {
  let newResumeToken = null;
  try {
    const changeStream = mongoCol.watch(pipeline, {
      resumeAfter: resumeToken,
    });
    newResumeToken = changeStream.resumeToken;
    changeStream.on("change", async (next) => {
      newResumeToken = changeStream.resumeToken;
      await eventHandler(next);
    });
    await closeChangeStream(changeStream, timeInMs);
  } catch (error) {
    console.log(error);
  } finally {
    // Return the resume token that was reached
    return newResumeToken; // Make sure that a resumeToken gets returned for saving
  }
}

async function monitorEventsSync(
  mongoCol,
  timeInMs = 600000,
  pipeline = [],
  resumeToken = null,
  eventHandler = (event) => console.log(event),
  saveResumeToken,
  resumeTokenFilePath
) {
  let newResumeToken = null;
  onExit(() => {
    if (newResumeToken) saveResumeToken(newResumeToken, resumeTokenFilePath);
  });
  try {
    const changeStream = mongoCol.watch(pipeline, { resumeAfter: resumeToken });
    closeChangeStream(changeStream, timeInMs); // Async, so code will run while this waits to close streamm
    try {
      while (await changeStream.hasNext()) {
        const event = await changeStream.next();
        newResumeToken = changeStream.resumeToken;
        await eventHandler(event);
      }
    } catch (error) {
      // If error is not because chandStream closed (expected), then report
      if (!changeStream.closed) {
        throw error;
      }
    }
  } finally {
    return newResumeToken;
  }
}

export default class ChangeStream {
  constructor(mongoCli, mongoCol, pipeline, eventHandler, resumeTokenFileName) {
    this.mongoCli = mongoCli;
    this.mongoCol = mongoCol;
    this.pipeline = pipeline;
    this.eventHandler = eventHandler;
    this.resumeTokenFileName = resumeTokenFileName;
  }

  // Function to setup stream and saving of cursor location
  async start() {
    console.log("------------------------------------------------------------");
    console.log("Seting up change stream.");

    // Get the path for resume token
    const __filename = fileURLToPath(import.meta.url); // Path of this file
    const __dirname = path.dirname(__filename); // Path of this file's dirs
    const resumeTokenFileName = "changeStreamResumeToken.txt";
    const resumeTokenFilePath = path.resolve(
      __dirname,
      "resumeTokens",
      resumeTokenFileName
    );

    // Load resumeToken (null if no prior stream)
    let resumeToken = loadResumeToken(resumeTokenFilePath);
    console.log("  resumeToken path: " + resumeTokenFilePath.toString());
    console.log(
      "  Loading resume token: " +
        (resumeToken
          ? resumeTokenToString(resumeToken)
          : "no resumeToken present")
    );

    // Connect to client and monitor events, saving resumeToken when finish/crash
    try {
      stdout.write("  Connecting to MongoDB --> ");
      await this.mongoCli
        .connect()
        .then(stdout.write(`SUCCESS\n`))
        .catch((err) => {
          stdout.write(`FAIL\n`);
          console.log(err);
        });
      let newResumeToken = null;

      // Infinitely create/close/save stream, 5 mins at a time
      console.log("Starting stream loop.");
      while (true) {
        // Run stream, handle events, get cursor position on completion
        console.log("  Stream -------");
        console.log(
          "    Start (" +
            getTime(new Date()) +
            ") @ event: " +
            resumeTokenToString(resumeToken)
        );
        newResumeToken = await monitorEventsSync(
          this.mongoCol,
          // 60000 * 5, // stream for 5 minutes
          60000 * 5, // 5 mins
          this.pipeline,
          resumeToken,
          this.eventHandler,
          saveResumeToken, // Pass so method can save resume token on SIGINT
          resumeTokenFilePath
        );

        // Save cursor to persistant storage (a file) when stream periodically
        // closes/starts
        console.log(
          "    End (" +
            getTime(new Date()) +
            ") @ event: " +
            resumeTokenToString(newResumeToken)
        );
        saveResumeToken(newResumeToken, resumeTokenFilePath);
        resumeToken = newResumeToken ? newResumeToken : resumeToken;
      }
    } finally {
      await this.mongoCli.close();
    }
    console.log("ChangeStream has eneded.");
  }
}
