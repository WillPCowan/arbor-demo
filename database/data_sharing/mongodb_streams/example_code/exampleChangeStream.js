import { MongoClient } from "mongodb";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // Path of this file
const __dirname = path.dirname(__filename); // Path of this file's dirs
const resumeTokenFileName = "exampleChangeStreamResumeToken.txt";
const resumeTokenBackupFileName = "exampleChangeStreamResumeToken__backup.txt";
const resumeTokenFilePath = path.resolve(__dirname, resumeTokenFileName);
const resumeTokenBackupFilePath = path.resolve(
  __dirname,
  resumeTokenBackupFileName
);

function resumeTokenToString(resumeToken) {
  return resumeToken._data;
}

function stringToResumeToken(resumeTokenStr) {
  return { _data: resumeTokenStr };
}

function getLastResumeToken() {
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

function saveResumeToken(resumeToken) {
  try {
    // Copy old resume token to backup file and save new one
    if (resumeToken) {
      if (fs.existsSync(resumeTokenBackupFilePath))
        fs.copyFileSync(resumeTokenFilePath, resumeTokenBackupFilePath);
      fs.writeFileSync(resumeTokenFilePath, resumeTokenToString(resumeToken), {
        flag: "w+",
      });
    } else {
      console.error(
        "No resume token provided for saving. If there is an existing resume token then there is an error recording the resume token from that point."
      );
    }
  } catch (error) {
    console.log("Issue savign resumeToken.");
    console.error(error);
  }
}

async function main() {
  const uri = "mongodb://localhost:27017/arbor";
  const client = new MongoClient(uri);

  const resumeToken = getLastResumeToken();
  console.log("Resume token: ");
  console.log(resumeToken);

  try {
    await client.connect();

    // Aggregation pipeline to match for 'Greggory' being added
    // const pipeline = [
    //   {
    //     $match: {
    //       operationType: "insert",
    //       "fullDocument.name": "Greggory",
    //     },
    //   },
    // ];

    // Monitor stream and save the updated resume token after closing or error
    const newResumeToken = await monitorTestEntriesUsingEventEmitter(
      client,
      15000,
      [],
      resumeToken
    );
    saveResumeToken(newResumeToken);
  } finally {
    await client.close();
  }
  console.log("ChangeStream has eneded.");
}

async function closeChangeStream(changeStream, timeInMs = 60000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Closing the change stream.");
      changeStream.close();
      resolve();
    }, timeInMs);
  });
}

main().catch(console.error);

// THREE DIFFERENT APROACHES TO USING MONGODB CHANGE STREAMS

// 1 - Using an event emitter -------------------------------------------------
async function monitorTestEntriesUsingEventEmitter(
  client,
  timeInMs = 600000,
  pipeline = [],
  startToken = null
) {
  let resumeToken = null;
  try {
    const collection = client.db("arbor").collection("users_test");
    collection.watch(pipeline);
    const changeStream = collection.watch(pipeline, {
      resumeAfter: startToken,
    });
    resumeToken = changeStream.resumeToken;
    changeStream.on("change", (next) => {
      resumeToken = changeStream.resumeToken;
      console.log(next);
    });
    await closeChangeStream(changeStream, timeInMs);
  } catch (error) {
    console.log(error);
  } finally {
    // Return the resume token that was reached
    return resumeToken; // Make sure that a resumeToken gets returned for saving
  }
}
