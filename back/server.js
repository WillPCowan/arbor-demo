import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema.js";
import cors from "cors";
import MongoConnector from "./data_access/mongodb/MongoConnector.js";

const PORT = 3333;
const server = express();

// Connect to database --------------------------------------------------------
const db = new MongoConnector("arbor");
db.connect();

// Enable CORS requests -------------------------------------------------------
// (e.g. in this case when front-end dev server speaks to backend server)
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
  // cors()
);

// Express --------------------------------------------------------------------
server.use(express.json());

// GraphQL --------------------------------------------------------------------
// On localhost:3333/graphql, serve request graphql request interface
server.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Serve the built front-end --------------------------------------------------
// On localhost:3333/build, serve the build
// const PROJECT_PATH =
//   "/home/willpcowan/code/testing/web/create-react-build-and-express";
// const BUILD_PATH = PROJECT_PATH + "/front/build";
const BUILD_PATH = "/home/willpcowan/code/projects/arbor-gpt3/front/build";
server.use("/", express.static(BUILD_PATH));

// Test we are reading from build directory
import fs from "fs";
var files = fs.readdirSync(BUILD_PATH);
files.forEach((file) => {
  console.log(file);
});

// Log & Listen ---------------------------------------------------------------
console.log("-------------------------------------------------");
console.log("Serving build from:\n" + BUILD_PATH + "\n");
console.log("PORT: " + PORT);
console.log("-------------------------------------------------");

server.listen(PORT);
