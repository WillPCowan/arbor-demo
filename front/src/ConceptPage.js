import graphql from "babel-plugin-relay/macro";
import React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import { useState } from "react";
import ConceptArea from "./components/ConceptArea";
import ContextPanel from "./components/ContextPanel";
import SideMenu from "./components/SideMenu";

// Styling
import "./styles/ConceptPage.scss";

const { Suspense } = React;

export default function ConceptPage(props) {
  // DATA DEPENDENCY ----------------------------------------------------------
  // Defines *what* data the component needs via a query. The responsibility of
  // actually fetching this data belongs to the route definition: it calls
  // preloadQuery() with the query and variables, and the result is passed
  // on props.prepared.issuesQuery - see src/routes.js
  const data = usePreloadedQuery(
    graphql`
      query ConceptPageQuery($name: String!) {
        concept(name: $name) {
          id
          name
          body
        }
      }
    `,
    // This follows the name of the property name for the object returned from
    // the 'prepare' function in routes.js, in this the prepare function for
    // ConceptPage
    props.prepared.conceptPageQuery
  );
  const { concept } = data;

  // TEXT SELECTION -----------------------------------------------------------
  const [selection, setSelection] = useState("");

  // When selection is made, update selection state
  async function handleSelection() {
    let sel = window.getSelection().toString();
    sel = sel == selection ? "" : sel; // Close selection box when selection is clicked on (idk why this works but it does)
    setSelection(sel);
  }

  // MENU TOGGLE --------------------------------------------------------------
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuOpenClass = isMenuOpen ? "open-menu" : "closed-menu";

  function handleMenuToggle() {
    setIsMenuOpen(!isMenuOpen);
  }

  // RENDER -------------------------------------------------------------------
  return (
    <div
      className={`sm-container concept-page ${menuOpenClass}`}
      onMouseUp={handleSelection}
    >
      <ConceptArea concept={concept} menuOpenClass={menuOpenClass} />
      {selection.length > 3 && <ContextPanel selection={selection} />}
      <SideMenu
        menuOpenClass={menuOpenClass}
        handleMenuToggle={handleMenuToggle}
      />
    </div>
  );
}
