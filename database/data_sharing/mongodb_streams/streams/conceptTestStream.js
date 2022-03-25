/**
 * A stream creating an elasticsearch index 'concept_names' from the MongoDB
 * 'concepts' collection, enabling the searching of concepts.
 */

// IMPORTS --------------------------------------------------------------------
import { MongoClient } from "mongodb";
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

  // Specify a filename to get/put this stream's resumeToken
  const resumeTokenFileName = "conceptTestStreamResumeToken.txt";

  // Test event handler
  const conceptEventHandler = (event) => {
    console.log(event);
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
