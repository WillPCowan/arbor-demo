import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

export default function ConceptArea({ concept, menuOpenClass }) {
  let { name, body } = concept;
  // body = body.substring(13, concept.body.length); // Slice off GPT template text
  body = ReactHtmlParser(body);

  return (
    <div className={`sm-content concept-area ${menuOpenClass}`}>
      <div className="concept-header">
        <h2 className="concept-name">{name}</h2>
        {/* <div className="concept-origin">
          {concept.origin.date.description +
            ", " +
            concept.origin.creators.description}
        </div> */}
      </div>
      <div className="concept-body">{body}</div>
    </div>
  );
}
