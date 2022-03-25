import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";

// import { GraphQLObjectType, GraphQLID } from "graphql-relay";
// import db from "../../database.js";
import { GQLUser, GQLConcept } from "../../types/Types.js";
import { nodeField, nodesField } from "../../nodeInterface.js";

// Mongoose Schemas
import User from "../../data_access/mongodb/schemas/User.js";
import Concept from "../../data_access/mongodb/schemas/Concept.js";

// Elasticsearch connector
import esCli from "../../data_access/elasticsearch/ElasticsearchConnector.js";

import gqlr from "graphql-relay";
const { fromGlobalId } = gqlr;

import { encode } from "gpt-3-encoder";
import OpenAI from "../../data_access/openai/OpenAIConnector.js";

import {
  topicExplainerPrompt,
  selectionElaboratorPrompt,
  essaySubtopicsPrompt,
  essaySubtopicWriterPrompt,
} from "../../data_access/openai/text_prompts.js";

/**
 * All the graphQL queries (not mutations)
 */

// NOTES:
//  + For table types (e.g. User, Concept) we must convert from global graph
//    ID into native IDs for db querying
//  + 'node' allows you to "enter the graph" with a globalID. I.e. allows you
//     to query the graph with the "node" type, rather than the specific
//     object type (e.g. UserType)
//  + 'nodes' allows you to look up a grpu of global IDs (as an array)
export const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    viewer: {
      type: GQLUser,
      // resolve: () => db.getViewer(),
      resolve: () => ({ id: 1, name: "ahhhh" }), // ID becomes global graph id (is that on front or back?)
    },
    user: {
      type: GQLUser,
      args: { id: { type: GraphQLID } },
      resolve: async (_, args) => {
        const { id } = fromGlobalId(args.id);
        return await User.getById(id);
        // return db.getUser(id);
      },
    },
    concept: {
      type: GQLConcept,
      args: { name: { type: GraphQLString } },
      resolve: async (_, args) => {
        // Check if concept synopsis is cached, otherwise get GPT-3 completion
        var res = await Concept.find({ name: args.name });
        // var res = await db.getConcept(args.name); // Try and get cached concept
        if (res.length != 0) {
          console.log("\nCACHE HIT" + "\n" + res[0]);
          return {
            id: res[0]._id,
            name: res[0].name,
            body: res[0].body,
          };
        }
        return await reqConceptEssay(args.name);
      },

      node: nodeField,
      nodes: nodesField,
    },
    elaboration: {
      type: GraphQLString,
      args: { selection: { type: GraphQLString } },
      resolve: async (_, args) => {
        // Get elaboration from GPT-3
        const { selection } = args;
        return await reqSelectionElaboration(selection);
      },
    },
    conceptSuggestions: {
      type: new GraphQLList(GraphQLString),
      args: { text: { type: GraphQLString } },
      resolve: async (_, args) => {
        console.log("RECEIVED SUGGESTION QUERY");
        const res = await esCli
          .search({
            index: "concept_names",
            body: {
              query: {
                multi_match: {
                  query: args.text,
                  type: "phrase_prefix",
                  fields: ["name", "name._2gram", "name._3gram"],
                },
              },
            },
          })
          .then((res) => {
            console.log("ES RESPONSE ------------------------");
            // console.log(res.body.hits.total);
            console.log(res.body.hits.hits);
            // // Return
            let suggs = res.body.hits.hits;
            console.log(suggs.map((sugg) => sugg._source.name));
            // return suggs.map(sugg => ({_id: sugg._id, name: sugg._source.name}))
            return suggs.map((sugg) => sugg._source.name);
          })
          .catch((err) => {
            console.log("Error fetching suggestions");
            console.log(err);
            return ["Error fetching suggestions"];
          });

        const delay = (time) => new Promise((res) => setTimeout(res, time));
        await delay(2000); // ! TESTING
        return res;
      },
    },
  }),
});

// GPT Requests ----------------------------------------------------------------
async function reqConceptEssay(name) {
  // Get an array of subtopic headings for the essay on given concept
  let subtopics = await generateConceptEssaySubtopics(name);

  // Ensure headings are formatted well: capitalise, punctuate
  subtopics = subtopics.map((subtopics) => ensureHeadingPretty(subtopics));

  // For each heading, GPT-3 writes the content
  let subtopicTexts = await generateConceptSubTexts(name, subtopics.slice(0));

  // Markup and combine the subtopic headings and the subtopic text, into
  // one string
  let conceptEssay = "";
  for (let i = 0; i < subtopics.length; i++) {
    // Append each header and its associated text
    conceptEssay += wrapInMarkupTags(subtopics[i], "<h3>");
    conceptEssay += wrapInMarkupTags(subtopicTexts[i], "<p>");
  }

  // Create the concept doc with the newly generated content
  let concept = null;
  try {
    // Cache concept and get new id
    concept = { name: name, body: conceptEssay };
    const res = await Concept.create(concept);
    console.log("RESPONSE TO CONCEPT CREATION");
    console.log(res);
    console.log("-----------------------------------");
    concept = { ...concept, id: res._id }; // Add new id to concept object
    console.log("THE ID IS: " + res._id);
  } catch (error) {
    console.error(error);
  }

  // Log the GPT-3 generated content
  logGPTRes("concept", concept);

  // Return
  return concept;
}

async function generateConceptEssaySubtopics(name) {
  // Get max size of GPT-3 subtopic list response
  let maxResSize = 2048 - encode(essaySubtopicsPrompt(name)).length;
  let promptSize = encode(essaySubtopicsPrompt(name)).length;
  logTokenLimit(promptSize, maxResSize);

  // Get subtopics
  let gptRes = null;
  try {
    gptRes = await OpenAI.complete({
      engine: "davinci",
      // prompt: prompt.text,
      // prompt: essaySubtopicsPrompt(name) + "\n",
      prompt: essaySubtopicsPrompt(name),
      maxTokens: maxResSize,
      // temperature: 0.9,
      temperature: 0.3,
      topP: 1,
      presencePenalty: 0.2,
      frequencyPenalty: 0.4,
      bestOf: 1,
      n: 1,
      stream: false,
      stop: ["\n", "testing"],
    });
  } catch (error) {
    console.error(error);
  }

  let subtopics = gptRes.data.choices[0].text;
  // ! deal with any repsonse text errors here

  // Process string into array of subtopics
  subtopics = subtopics.replace("[", "").replace("]", "").split(";");
  if (subtopics[subtopics.length - 1] == "") subtopics.pop();
  for (var i = 0; i < subtopics.length; i++) {
    // Remove spaces for each topic
    subtopics[i] = subtopics[i].substring(1, subtopics[i].length - 1);
  }
  return subtopics;
}

async function generateConceptSubTexts(topic, subtopics) {
  // Add empty string buffers to array of subtopics. This is needed because the
  // prompt requires "preceding"/"next"-"subtopic" parameters, which is "" for
  // start and end topics.
  subtopics.unshift("");
  subtopics.push("");

  // Send GPT-3 req for each subtopic
  let subtopicTexts = null;
  try {
    let subtopicTextReqs = [];
    let maxResSize = null;
    let promptSize = null;
    for (let i = 1; i < subtopics.length - 1; i++) {
      let crntEssaySubtopicsPrompt = essaySubtopicWriterPrompt(
        topic,
        subtopics[i - 1],
        subtopics[i],
        subtopics[i + 1]
      );
      maxResSize = 2048 - encode(crntEssaySubtopicsPrompt).length;
      promptSize = encode(crntEssaySubtopicsPrompt).length;
      logTokenLimit(promptSize, maxResSize);

      subtopicTextReqs.push(
        OpenAI.complete({
          engine: "davinci",
          // prompt: prompt.text,
          prompt: crntEssaySubtopicsPrompt,
          maxTokens: maxResSize,
          // temperature: 0.9,
          temperature: 0.3,
          topP: 1,
          presencePenalty: 0.1,
          frequencyPenalty: 0.2,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: ["\n", "testing"],
        })
      );
    }

    // Wait for all requests to resolve (all subtopic texts to be written)
    subtopicTextReqs = Promise.all(subtopicTextReqs);
    subtopicTexts = await subtopicTextReqs
      .then((res) => res)
      .catch((err) => {
        console.log(error);
        return err;
      });
    // ! check the subtopicTexts arr for returned err, otherwise gptRes.data is null
    subtopicTexts = subtopicTexts.map((gptRes) => gptRes.data.choices[0].text);
    console.log(subtopicTexts);
  } catch (error) {
    console.log(error);
  }

  // Strip off ' \"' from the start and '\"` from the end fo returned texts
  subtopicTexts = subtopicTexts.map((text) =>
    text.substring(2, text.length - 1)
  );

  return subtopicTexts;
}

async function reqConceptOrigin(name) {
  let maxResSize = 2048 - encode(essaySubtopicsPrompt(name)).length;
  let promptSize = encode(essaySubtopicsPrompt(name)).length;
}

async function reqConceptSynopsis(name) {
  // Get max size of GPT-3 topic summary & report size of response
  const maxResSize = 2048 - encode(topicExplainerPrompt + name).length;
  const promptSize = encode(topicExplainerPrompt + name).length;
  logTokenLimit(promptSize, maxResSize);

  let concept = null;
  try {
    const gptRes = await OpenAI.complete({
      engine: "davinci",
      // prompt: prompt.text,
      prompt: topicExplainerPrompt + name + "\n",
      maxTokens: maxResSize,
      // temperature: 0.9,
      temperature: 0.5,
      topP: 1,
      presencePenalty: 0.1,
      frequencyPenalty: 0.2,
      bestOf: 1,
      n: 1,
      stream: false,
      stop: ["\n", "testing"],
    });

    concept = { name: name, body: gptRes.data.choices[0].text };

    // Cache concept and get new id
    // const res = await db.addConcept(concept);
    const res = await Concept.create(concept);
    concept = { ...concept, id: res._id }; // Add new id to concept object
    console.log("THE ID IS: " + res._id);
  } catch (error) {
    console.error(error);
  }

  logGPTRes("concept", concept);
  return concept;
}

async function reqSelectionElaboration(selection) {
  // Confirm selection is not too large (do on front too)
  const prompt =
    selectionElaboratorPrompt + ' "' + selection + '"' + "\nExplanation";
  if (encode(prompt).length > 2048) {
    console.error("Selection is too large.");
    return "";
  }

  const maxResSize = 2048 - encode(prompt).length;
  let gptRes;
  try {
    gptRes = await OpenAI.complete({
      engine: "davinci",
      // prompt: prompt.text,
      prompt:
        selectionElaboratorPrompt + '"' + selection + '"' + "\nExplanation:",
      maxTokens: maxResSize,
      temperature: 0.9,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      bestOf: 1,
      n: 1,
      stream: false,
      stop: ["\n", "testing"],
    });
  } catch (error) {
    console.error(error);
  }

  const elaboration = gptRes.data.choices[0].text;
  logGPTRes("elaboration", elaboration);
  return elaboration;
}

// Helpers ---------------------------------------------------------------------
function logTokenLimit(promptSize, maxTokensInRes) {
  console.log("\nTOKEN LIMIT TEST");
  console.log("  > Prompt:  " + promptSize);
  console.log("  > Max Res: " + maxTokensInRes);
  console.log("  > Target:  2048");
  console.log("  > Actual:  " + (maxTokensInRes + promptSize));
}

function logGPTRes(type, res) {
  console.log("\nGENERATED " + res);
  console.log(res);
}

function wrapInMarkupTags(str, tag) {
  return tag + str + tag[0] + "/" + tag.substring(1, tag.length);
}

function ensureHeadingPretty(headingText) {
  // Ensure first letter is capitalised
  headingText = headingText.charAt(0).toUpperCase() + headingText.slice(1);

  // Ensure questions are punctuated (simple solution, will miss cases)
  const questionPatterns = RegExp("How|Where|What|Who|When");
  const questionMatch = questionPatterns.exec(headingText);
  if (
    headingText.charAt(headingText.length - 1) != "?" &&
    questionMatch.index == 0
  ) {
    headingText = headingText + "?";
  }
  return headingText;
}
