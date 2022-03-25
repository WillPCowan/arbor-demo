import { GraphQLString, GraphQLNonNull, GraphQLInt } from "graphql";
import gqlRelay from "graphql-relay";
const { mutationWithClientMutationId } = gqlRelay;

import db from "../../database.js";
import { UserType } from "../../types/Types.js";

/**
 *
 */
export const DeleteUserMutation = mutationWithClientMutationId({
  name: "deleteUser",
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    // userId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    deletedUser: {
      type: UserType,
      resolve: (payload) => payload.user,
    },
  },
  mutateAndGetPayload: ({ id }) => db.deleteUser(id),
});

/**
 *
 */
export const UpdateUserMutation = mutationWithClientMutationId({
  name: "updateUser",
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  outputFields: {
    deletedUser: {
      type: UserType,
      resolve: (payload) => payload.user,
    },
  },
  mutateAndGetPayload: ({ id, name, username, email, password }) =>
    db.editUser(id, name, username, email, password),
});

/**
 *
 */
export const AddUserMutation = mutationWithClientMutationId({
  name: "addUser",
  inputFields: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  outputFields: {
    newUser: {
      type: UserType,
      resolve: (payload) => payload,
    },
  },
  mutateAndGetPayload: ({ name, username, email, password }) =>
    db.addUser(name, username, email, password),
});
