import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

import { RelayEnvironmentProvider } from "react-relay/hooks";
import environment from "./Environment";

// Routing
import RouterRenderer from "./routing/RouterRenderer";
import RoutingContext from "./routing/RoutingContext";
import createRouter from "./routing/createRouter";
import routes from "./routes";

// Uses the custom router setup to define a router instanace that we can pass through context
const router = createRouter(routes);

ReactDOM.render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <RoutingContext.Provider value={router.context}>
        {/* Render the active route */}
        <RouterRenderer />
      </RoutingContext.Provider>
    </RelayEnvironmentProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
