import { MongoClient } from "mongodb";
import stream from "stream";

async function main() {
  const uri = "mongodb://localhost:27017/arbor";
  const client = new MongoClient(uri);

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

    // await monitorTestEntriesUsingEventEmitter(client, 15000);
    // await monitorTestEntriesUsingHasNext(client, 15000);
    const resumeToken = await monitorTestEntriesUsingEventEmitter(
      client,
      15000
    );
    // WRITE TOKEN TO SAVE FILE
  } finally {
    await client.close();
  }
}

async function closeChangeStream(changeStream, timeInMs = 60000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("CLosing the change stream.");
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
  resumeToken = null
) {
  const collection = client.db("arbor").collection("testcollection");
  collection.watch(pipeline);
  const changeStream = collection.watch(pipeline);
  const resumeToken = changeStream.resumeToken;
  changeStream.on("change", (next) => {
    console.log(next);
  });
  await closeChangeStream(changeStream, timeInMs);
}

// 2 - Using hasNext and a while loop -----------------------------------------
async function monitorTestEntriesUsingHasNext(
  client,
  timeInMs = 60000,
  pipeline = []
) {
  const collection = client.db("arbor").collection("testcollection");
  const changeStream = collection.watch(pipeline);
  try {
    while (await changeStream.hasNext()) {
      const event = await changeStream.next();
      console.log(event);
    }
  } catch (error) {
    if (changeStream.closed) {
      console.log(
        "The change stream is closed. Will not wait on any more changes."
      );
    } else {
      throw error;
    }
  }
  await closeChangeStream(changeStream, timeInMs);
}

// 3 - Using Node.js's 'stream' api -------------------------------------------
async function monitorTestEntriesUsingStreamAPI(
  client,
  timeInMs = 60000,
  pipeline = []
) {
  const collection = client.db("arbor").collection("testcollection");
  const changeStream = collection.watch(pipeline);
  changeStream.stream().pipe(
    new stream.Writable({
      objectMode: true,
      write: function (doc, _, cb) {
        console.log(doc);
        //...
        cb();
      },
    })
  );
  await closeChangeStream(changeStream, timeInMs);
}
