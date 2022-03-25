import { MongoClient } from "mongodb";
import casual from "casual";

async function main() {
  const uri = "mongodb://localhost:27017/arbor";
  const client = new MongoClient(uri);

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

    // Create test collection
    // await client.db("arbor").createCollection("users_test");

    // TEST 1 -----------------------------------
    // // Create test events (CRUD)
    // let users = [];
    // for (let i = 0; i < 4; i++) {
    //   users.push(
    //     await createUser(client, {
    //       name: casual.name,
    //       age: casual.integer(18, 99),
    //     })
    //   );
    // }

    // await updateUser(client, users[2], {
    //   age: casual.integer(18, 99),
    // });

    // await deleteUser(client, users[3]);

    // TEST 2: insertMany ------------------------------------------
    // let users = [];
    // for (let i = 0; i < 4; i++) {
    //   users.push({ name: casual.name, age: casual.integer(18, 99) });
    // }
    // await client.db("arbor").collection("users_test").insertMany(users);

    // TEST 3: replace ---------------------------------------------
    let users = [];
    for (let i = 0; i < 4; i++) {
      users.push(
        await createUser(client, {
          name: casual.name,
          age: casual.integer(18, 99),
        })
      );
    }

    await replaceUser(client, users[2], {
      name: casual.name,
      age: casual.integer(18, 99),
    });

    // Delete test collection
    // await client.db("arbor").collection("user_test").drop();
  } finally {
    client.close();
  }
}

main().catch((err) => console.log(err));

async function createUser(client, newUser) {
  const res = await client
    .db("arbor")
    .collection("users_test")
    .insertOne(newUser);
  console.log(`New user created with the following id: ${res.insertedId}`);
  return res.insertedId;
}

async function updateUser(client, userId, updatedUser) {
  const res = await client
    .db("arbor")
    .collection("users_test")
    .updateOne({ _id: userId }, { $set: updatedUser });
  console.log(`${res.matchedCount} document(s) matched the query criteria.`);
  console.log(`${res.modifiedCount} document(s) was/were updated.`);
}

async function deleteUser(client, userId) {
  const res = await client
    .db("arbor")
    .collection("users_test")
    .deleteOne({ _id: userId });
  console.log(`${res.deletedCount} document(s) was/were deleted.`);
}

async function replaceUser(client, userId, newUserObj) {
  const res = await client
    .db("arbor")
    .collection("users_test")
    .replaceOne({ _id: userId }, newUserObj);
  console.log(`${res.modifiedCount} document(s) was/were replaced.`);
  console.log(`  >> OLD ID: ${userId}`);
  console.log(`  >> NEW ID: ${res.insertedId}`);
  console.log(res);
  return res.insertedId;
}
