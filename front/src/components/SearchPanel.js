import { useState } from "react";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import graphql from "babel-plugin-relay/macro";

// Components
import Loader from "../components/Loader.js";

// SVGs
import { ReactComponent as SearchIcon } from "../svg/mono-icons/search.svg";
import React, { Suspense } from "react";
// import SearchIcon from "../svg/mono-icons/search.svg";

// type FormValues = {
//   text: string;
// };

export default function SearchPanel(props) {
  const [searchVal, setSearchVal] = useState("");

  const [queryReference, loadQuery] = useQueryLoader(SuggestionQuery);

  // Submit suggestions query sending the current text input value
  return (
    <div className="searchpanel">
      <form className="searchpanel__input">
        <SearchIcon className="searchpanel__search-icon" />
        <input
          type="search"
          value={searchVal}
          onChange={(e) => {
            let newVal = e.target.value;
            setSearchVal(newVal);
            loadQuery({ text: newVal });
            console.log("Loading suggestions for: " + newVal);
            // update field value
          }}
        />
      </form>
      <SearchSuggestions queryRef={queryReference} searchVal={searchVal} />
    </div>
  );
}

function SearchSuggestions({ queryRef, searchVal }) {
  // Search suggestions states
  // 0 -> Untyped, no req sent, no suggs
  // 1 -> Typed, response: pending
  // 2 -> Typed, response: empty
  // 3 -> Typed, response: suggs < max
  // 4 -> Typed, respones: suggs == max

  return (
    <div className="searchpanel__suggestions">
      {queryRef ? (
        <Suspense fallback={<Loader show={true}></Loader>}>
          <SuggestionOptions queryRef={queryRef} searchVal={searchVal} />
        </Suspense>
      ) : (
        <SuggestionOptionsNone />
      )}
    </div>
  );
}

function SuggestionOptions({ queryRef, searchVal }) {
  const suggsQuery = usePreloadedQuery(SuggestionQuery, queryRef);
  const suggs = suggsQuery.conceptSuggestions;

  return (
    <>
      {suggs && suggs.length > 0 ? (
        <div className="searchpanel__suggestion-list">
          {suggs.map((sugg) => (
            <div className="searchpanel__suggestion-list-item">
              <p className="searchpanel__suggestion-list-item-text">
                {emphasiseStringVal(sugg, searchVal)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <SuggestionOptionsNone />
      )}
    </>
  );
}

function SuggestionOptionsNone() {
  return (
    <div className="searchpanel__suggestion-list--none">
      No search suggestions.
    </div>
  );
}

export const SuggestionQuery = graphql`
  query SearchPanelConceptSuggestionsQuery($text: String) {
    conceptSuggestions(text: $text)
  }
`;

function emphasiseStringVal(string, targetVal) {
  let startIdx = string.indexOf(targetVal);
  if (startIdx === -1) return string;
  let endIdx = startIdx + targetVal.length;

  return (
    <>
      {string.substring(0, startIdx)}
      <strong>{string.substring(startIdx, endIdx)}</strong>
      {string.substring(endIdx, string.length)}
    </>
  );
}
