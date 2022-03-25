import { GraphQLObjectType } from "graphql";
import * as UserMutations from "./UserMutations.js";

export const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addRace: UserMutations.AddUserMutation,
    deleteRace: UserMutations.DeleteUserMutation,
    editRace: UserMutations.UpdateUserMutation,
  }),
});
