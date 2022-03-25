/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SearchPanelConceptSuggestionsQueryVariables = {|
  text?: ?string
|};
export type SearchPanelConceptSuggestionsQueryResponse = {|
  +conceptSuggestions: ?$ReadOnlyArray<?string>
|};
export type SearchPanelConceptSuggestionsQuery = {|
  variables: SearchPanelConceptSuggestionsQueryVariables,
  response: SearchPanelConceptSuggestionsQueryResponse,
|};
*/


/*
query SearchPanelConceptSuggestionsQuery(
  $text: String
) {
  conceptSuggestions(text: $text)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "text"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "text",
        "variableName": "text"
      }
    ],
    "kind": "ScalarField",
    "name": "conceptSuggestions",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchPanelConceptSuggestionsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SearchPanelConceptSuggestionsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "400addb1f2e930dae67707694d7fae5a",
    "id": null,
    "metadata": {},
    "name": "SearchPanelConceptSuggestionsQuery",
    "operationKind": "query",
    "text": "query SearchPanelConceptSuggestionsQuery(\n  $text: String\n) {\n  conceptSuggestions(text: $text)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c07b7f03295eb6c81453d2edbf1938a8';

module.exports = node;
