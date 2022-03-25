import { MongoClient } from "mongodb";
import casual from "casual";

const uri = "mongodb://localhost:27017/arbor";
const dbName = "arbor";
const client = new MongoClient(uri);
const colName = "concepts";

async function main() {
  try {
    await client
      .connect()
      .then((res) => {
        console.log("Connected");
      })
      .catch((err) => {
        console.log("Connection error:");
        console.log(err);
      });

    // TEST 1: simple CRUD ----------------------------------------------------
    let entities = [];
    let n = 4;
    for (let i = 0; i < n; i++) {
      entities.push(
        await create(client, {
          name: casual.catch_phrase,
        })
      );
    }

    await del(client, entities[n - 1]);
    // await update(client, entities[2], {
    //   name: casual.catch_phrase,
    // });

    console.log(entities[n - 1].toString());
    console.log(entities[n - 2].toString());
  } finally {
    client.close();
  }
}

main().catch((err) => console.log(err));

async function create(client, newEntity) {
  const res = await client.db(dbName).collection(colName).insertOne(newEntity);
  console.log(`New entity created with the following id: ${res.insertedId}`);
  return res.insertedId;
}

async function update(client, entityId, updatedEntityFields) {
  const res = await client
    .db(dbName)
    .collection(colName)
    .updateOne({ _id: entityId }, { $set: updatedEntityFields });
  console.log(`${res.matchedCount} document(s) matched the query criteria.`);
  console.log(`${res.modifiedCount} document(s) was/were updated.`);
}

async function del(client, entityId) {
  const res = await client
    .db(dbName)
    .collection(colName)
    .deleteOne({ _id: entityId });
  console.log(`${res.deletedCount} document(s) was/were deleted.`);
}

async function replace(client, entityId, newEntityObj) {
  const res = await client
    .db(dbName)
    .collection(colName)
    .replaceOne({ _id: entityId }, newEntityObj);
  console.log(`${res.modifiedCount} document(s) was/were replaced.`);
  console.log(`  >> OLD ID: ${entityId}`);
  console.log(`  >> NEW ID: ${res.insertedId}`);
  console.log(res);
  return res.insertedId;
}
