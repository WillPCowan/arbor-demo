import mongoose from "mongoose";

// Connect to mongoose server
const host = "localhost";
const dbname = "arbor";
mongoose.connect(
  "mongodb://localhost/arbor",
  () => {
    console.log("Connected to database.");
  },
  (e) => {
    console.log("Error connecting to database.");
    console.log(e);
  }
);

// Create a test schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    age: Number,
    email: String,
  },
  { timestamps: true }
);

// Create a model for test schema, and clear it
const UserModel = mongoose.model("User", userSchema);
await UserModel.deleteMany({});

// Add multiple test objects
let names = ["Will", "Amir", "Sumin", "Tom"];
let usernames = ["FIREATWlLL", "BigBoyLeRoy", "YummyBunny", "TankEngine"];
let ages = [23, 23, 21, 22];
let emails = ["willmail", "amail", "Sumail", "Tomailto"];

// await (async () => {
//   let user = null;
//   for (var i = 0; i < names.length; i++) {
//     user = await UserModel.create({
//       name: names[i],
//       username: usernames[i],
//       age: ages[i],
//       email: emails[i],
//     });
//     console.log(user);
//   }
// })();

let user = null;
for (var i = 0; i < names.length; i++) {
  user = await UserModel.create({
    name: names[i],
    username: usernames[i],
    age: ages[i],
    email: emails[i],
  });
  // console.log(user);
  console.log("Added user: " + user.username);
}

// Find people of ages 23
let twentyTwos = await UserModel.find({ age: 22 });
console.log(twentyTwos);

console.log("Done...............................");

mongoose.disconnect();
