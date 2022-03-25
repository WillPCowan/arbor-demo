// External libs
import React, { useState } from "react";

// Custom libs
import { useUserData, useOnKeyDown, useOnAltKeyComboDown } from "./lib/hooks";
import { UserContext, GlobalUIContext } from "./lib/contexts";

// Components
import Header from "./components/Header";
import Cloak from "./components/Cloak";
import SearchPanel from "./components/SearchPanel";

// Styling
import "./styles/App.scss";

/**
 * Root of the application, wrapping all subroutes.
 * i.e. the RootQuery and Root component is included in all pages.
 * All other pages passed into Root via props.children.
 *
 * @param {*} props
 * @returns
 */
export default function Root(props) {
  const user = useUserData();

  console.log("Root render");

  // SEARCH -------------------------------------------------------------------
  const [isSearching, setIsSearching] = useState(false);
  const toggleSearchPanel = () => setIsSearching(!isSearching);
  const disableSearchPanel = () => setIsSearching(false);

  useOnKeyDown("#", toggleSearchPanel);
  useOnAltKeyComboDown("Enter", toggleSearchPanel);
  useOnKeyDown("Escape", disableSearchPanel);

  return (
    <UserContext.Provider value={user}>
      {/* Update GlobalUIContext to use Root's state and setter for searching */}
      {/* -> means you can have GUIContext in /lib/contexts, and link */}
      <GlobalUIContext.Provider value={{ isSearching, setIsSearching }}>
        {isSearching && (
          <>
            <Cloak handleClick={disableSearchPanel} />
            <SearchPanel />
          </>
        )}
        <Header />
        <div className="root">{props.children}</div>
      </GlobalUIContext.Provider>
    </UserContext.Provider>
  );
}

// export default function Root(props) {
//   // Defines *what* data the component needs via a query. The responsibility of
//   // actually fetching this data belongs to the route definition: it calls
//   // preloadQuery() with the query and variables, and the result is passed
//   // on props.prepared.issuesQuery - see src/routes.js
//   const data = usePreloadedQuery(
//     graphql`
//       query RootQuery($owner: String!, $name: String!) {
//         repository(owner: $owner, name: $name) {
//           owner {
//             login
//           }
//           name
//         }
//       }
//     `,
//     props.prepared.rootQuery,
//   );
//   const { repository } = data;

//   return (
//     <div className="root">
//       <header className="header">
//         {repository.owner.login}/{repository.name}: Issues
//       </header>
//       <section className="content">
//         {/* Wrap the child in a Suspense boundary to allow rendering the
//         layout even if the main content isn't ready */}
//         <Suspense fallback={'Loading...'}>{props.children}</Suspense>
//       </section>
//     </div>
//   );
// }
