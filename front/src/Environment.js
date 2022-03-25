const { Environment, Network, RecordSource, Store } = require("relay-runtime");

// Application store & network
const store = new Store(new RecordSource());
const network = Network.create(fetchPolicy);

// Environment provides functionality of Relay at run-time
export default new Environment({
  network,
  store,
});

// How the Network layer can fetch GrahpQL queries
async function fetchPolicy(params, variables) {
  // Fetch data from GitHub's GraphQL API:
  const response = await fetch("http://localhost:3333/graphql", {
    method: "POST",
    credentials: "include", // Allow cookies to be sent
    headers: {
      Authorization: `*/*`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  // Get the response as JSON
  const json = await response.json();

  // GraphQL returns exceptions (for example, a missing required variable) in the "errors"
  // property of the response. If any exceptions occurred when processing the request,
  // throw an error to indicate to the developer what went wrong.
  if (Array.isArray(json.errors)) {
    console.log(json.errors);
    console.error(
      `Error fetching GraphQL query '${
        params.name
      }' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
        json.errors
      )}`
    );
    throw new Error(json.errors[0].message);
    // TODO want to try {dev: "msg", viewer: json.errors....}
    // TODO but wasn't working
  }

  // Otherwise, return the full payload.
  return json;
}

// Allow cookie to be sent in header so express-session can recognise same session
// (by default, Relay does not send cookie, so express thinks it is a new session
// every time)
// Relay.injectNetworkLayer(
//   new Relay.DefaultNetworkLayer("/graphql", {
//     credentials: "same-origin",
//   })
// );
