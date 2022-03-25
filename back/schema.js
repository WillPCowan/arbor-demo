import gql from "graphql";
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = gql;

import { RootQuery } from "./schema/queries/RootQuery.js";
// import { RootMutation } from "./schema/mutations/RootMutation.js";

export const schema = new GraphQLSchema({
  query: RootQuery,
  // mutation: RootMutation,
});

// ----------------------------------------------------------------------------
// WORKED IN PRIOR DEMO ---------------------
// const RootQuery = new GraphQLObjectType({
//   name: "Query",
//   fields: () => ({
//     viewer: {
//       type: GraphQLString,
//       resolve() {
//         return "viewer";
//       },
//     },
//     concept: {
//       type: GraphQLString,
//       resolve: () => {
//         return "concept";
//       },
//     },
//   }),
// });

// // const RootMutation = new GraphQLObjectType({
// //   name: "Mutation",
// //   fields: () => ({}),
// // });

// export const schema = new GraphQLSchema({
//   query: RootQuery,
//   // mutation: RootMutation,
// });

// import { RootQuery } from "./schema/queries/RootQuery.js";
// // import { RootMutation } from "./schema/mutations/RootMutation.js";
