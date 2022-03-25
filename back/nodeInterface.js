/**
 * A file exporting a node interface (i.e. a way of mapping the temporary
 * and global "graph node" IDs from the database objects ID, and vice versa).
 */
import pkg from "graphql-relay";
const { nodeDefinitions } = pkg;
import { GQLUser, GQLConcept } from "./types/Types.js";

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  getNativeID,
  makeGlobalID
);

// Global "graph node" IDs --> native database IDs
function getNativeID(globalID) {
  const { type, id } = fromGlobalId(globalId);
  if (type === "User") return db.getUser(id);
  if (type === "Concept") return db.getConcept(id);
  return null;
}

// Native database IDs --> global "graph node" IDs
function makeGlobalID(obj) {
  if (obj.email) {
    return GQLUser;
  }
  if (obj.body) {
    return GQLConcept;
  }
  return null;
}
