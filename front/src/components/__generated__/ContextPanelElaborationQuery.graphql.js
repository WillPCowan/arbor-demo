/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContextPanelElaborationQueryVariables = {|
  selection?: ?string
|};
export type ContextPanelElaborationQueryResponse = {|
  +elaboration: ?string
|};
export type ContextPanelElaborationQuery = {|
  variables: ContextPanelElaborationQueryVariables,
  response: ContextPanelElaborationQueryResponse,
|};
*/


/*
query ContextPanelElaborationQuery(
  $selection: String
) {
  elaboration(selection: $selection)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "selection"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "selection",
        "variableName": "selection"
      }
    ],
    "kind": "ScalarField",
    "name": "elaboration",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ContextPanelElaborationQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ContextPanelElaborationQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6bba9e02abe2f0e1d8c7905a780b4412",
    "id": null,
    "metadata": {},
    "name": "ContextPanelElaborationQuery",
    "operationKind": "query",
    "text": "query ContextPanelElaborationQuery(\n  $selection: String\n) {\n  elaboration(selection: $selection)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '65120102b6fd0977f74ddced9de0aff3';

module.exports = node;
