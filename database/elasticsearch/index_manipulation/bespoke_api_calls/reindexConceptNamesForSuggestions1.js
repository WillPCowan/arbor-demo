import reindex from "../reindex.js";

/**
 * Reindex the 'concept_names' index so it uses the search-as-you-type type on
 * the 'name' field.
 */

const indexName = "concept_names";
const newIndexName = "concept_names";
const indexMappingsAndSettings = {
  mappings: {
    properties: {
      name: {
        type: "search_as_you_type",
      },
    },
  },
};

reindex(indexName, indexMappingsAndSettings, newIndexName);
