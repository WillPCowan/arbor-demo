// import { ElaborationQuery } from "../queries";
// Styles
import "../styles/ContextPanel.scss";
import React, { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import graphql from "babel-plugin-relay/macro";

// ! LEFT OFF
// ! ElaborationDisplay doesn't even get to run, something fails in
// ! ContextPanel before render can occur, find out waht

export default function ContextPanel({ selection }) {
  return (
    <div className="context-panel">
      <div className="selection">
        "
        {selection.length > 60 ? selection.substring(0, 57) + "..." : selection}
        "
      </div>

      {selection.length > 3 ? (
        <Suspense fallback="Loading...">
          <ElaborationDisplay selection={selection}></ElaborationDisplay>
        </Suspense>
      ) : (
        "Selection must be >3 chars long"
      )}
    </div>
  );
}

function ElaborationDisplay({ selection }) {
  const data = useLazyLoadQuery(ElaborationQuery, { selection: selection });
  return <div>{data.elaboration}</div>;
}

// export const ElaborationQuery = graphql`
//   query ContextPanelElaborationQuery {
//     elaboration(selection: "synapses are the connections between neurons")
//   }
// `;

export const ElaborationQuery = graphql`
  query ContextPanelElaborationQuery($selection: String) {
    elaboration(selection: $selection)
  }
`;
