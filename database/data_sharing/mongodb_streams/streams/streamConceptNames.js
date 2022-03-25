/**
 * A stream creating an elasticsearch index 'concept_names' from the MongoDB
 * 'concepts' collection, enabling the searching of concepts.
 */

// IMPORTS --------------------------------------------------------------------
import { MongoClient } from "mongodb";
import { Client } from "@elastic/elasticsearch";
import ChangeStream from "../ChangeStream.js";

// MAIN -----------------------------------------------------------------------
// The code tailored to this specific stsream
async function main() {
  // Specify the source mongo database and collection for this stream
  const mongoHost = "mongodb://localhost:27017/arbor";
  const mongoDbName = "arbor";
  const mongoColName = "concepts";
  const mongoCli = new MongoClient(mongoHost);
  const mongoCol = mongoCli.db(mongoDbName).collection(mongoColName);

  // Setup the ES index we want to copy events into, and setup the client
  const esHost = "http://localhost:9200";
  const esIndex = "concept_names";
  const esCli = new Client({ node: esHost });
  console.log("Wating for elastic cluster...");
  await esCli
    .ping()
    .then(() => console.log("Elasticsearch cluster working."))
    .catch((err) => {
      console.log("Elasicsearch cluster down!");
      console.log(err);
      throw new Error(err);
    });

  // NOTE: elasticsearch auto-creates index if doesn't exist, no logic needed

  // Specify a filename to get/put this stream's resumeToken
  const resumeTokenFileName = "conceptTitleStreamResumeToken.txt";

  // Setup a change event handler, using client to mirror Mongo events in ES
  // Event handler, streaming data to elasticsearch
  const conceptEventHandler = async (event) => {
    switch (event.operationType) {
      case "insert":
        console.log("INSERTING");
        await esCli.create({
          index: esIndex,
          id: event.fullDocument._id.toString(),
          body: {
            name: event.fullDocument.name,
          },
        });
        console.log("INSERT into elasticsearch");
        console.log("------------------------------------");
        console.log(event.fullDocument);
        console.log("------------------------------------");
        break;
      case "delete":
        await esCli.delete({
          index: esIndex,
          id: event.fullDocument._id.toString(),
        });
        console.log("DELETE from elasticsearch");
        console.log("------------------------------------");
        console.log(event.fullDocument);
        console.log("------------------------------------");
        break;
      case "update":
        console.log("UPDATING");
        const update = event.updateDescription.updatedFields;
        await esCli.update({
          index: esIndex,
          id: event.documentKey._id.toString(),
          body: { doc: update }, // This wrapper is needed for update because elasticsearch hates developers
        });
        console.log("UPDATE IN elasticsearch");
        console.log("------------------------------------");
        console.log(event.updateDescription);
        console.log("------------------------------------");
        break;
      case "replace":
        await esCli.update({
          index: esIndex,
          id: event.fullDocument._id.toString(),
          body: { name: event.fullDocument.name },
        });
        console.log("REPLACE elasticsearch");
        console.log("------------------------------------");
        console.log(event.fullDocument);
        console.log("------------------------------------");
        break;
      default:
      // code block
    }
  };

  // Setup an aggregation pipeline filtering for concept events we care about
  const conceptNamePipeline = [
    {
      $match: {
        $or: [
          { operationType: "insert" },
          { operationType: "delete" },
          { operationType: "update" },
          { operationType: "replace" },
        ],
      },
    },
  ];

  // Setup and run the change stream
  const stream = new ChangeStream(
    mongoCli,
    mongoCol, // Where to stream from
    conceptNamePipeline, // Filter for stream events
    conceptEventHandler, // What to do with events
    resumeTokenFileName // Where to store resumeToken if stream closed
  );
  stream.start();
}

main();
