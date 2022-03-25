import fs from "fs";
import { printSchema } from "graphql";
import { schema } from "./schema.js";

fs.writeFileSync("./schema.graphql", printSchema(schema));
