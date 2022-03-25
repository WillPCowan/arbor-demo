// ! THESE ARE JUST FOR SAVING, to use you must embed in resolver

// For type: search-as-you-type
export default conceptSuggestionQuery = {
  index: "concept_names",
  body: {
    query: {
      multi_match: {
        query: args.text, // ! THIS WON'T WORK UNLESS EMBEDDED IN RESOLVER
        type: "bool_prefix",
        fields: ["name", "name._2gram", "name._3gram"],
      },
    },
  },
};

// For phrase suggester
export default conceptSuggestionQuery = {
  index: "concept_names",
  body: {
    "suggest": {
      "text": args.text, // ! THIS WON'T WORK UNLESS EMBEDDED IN RESOLVER
      "simple_phrase": {
        "phrase": {
          "field": "name.trigram",
          "size": 1,
          "gram_size": 3,
          "direct_generator": [ {
            "field": "name.trigram",
            "suggest_mode": "always"
          } ],
          "highlight": {
            "pre_tag": "<em>",
            "post_tag": "</em>"
          }
        }
      }
    }
  }
}