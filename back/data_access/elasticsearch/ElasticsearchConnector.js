// Imports
import { Client } from "@elastic/elasticsearch";
import { exit } from "process";

// Connect to the elasticsearch database
const esHost = process.env.ES_HOSTNAME || "localhost";
const esPort = 9200;
const esCli = new Client({ node: `http://${esHost}:${esPort}` });

// Test connection to Elastic search
console.log("\n[ Elasticsearch Connector ]");
console.log("------------------------------------------");
console.log(
  `Testing connection to elasticsearch cluster at http://${esHost}:${esPort}.`
);
esCli
  .ping()
  .then(console.log(" > REACHABLE"))
  .catch((err) => {
    console.log(" > UNREACHABLE");
    console.log(err);
    exit(1);
  });
console.log("------------------------------------------\n");

export default esCli;
