import React, { useState, useContext } from "react";
import { GlobalUIContext } from "../lib/contexts";

export default function Searcbutton({ className }) {
  const [query, setQuery] = useState(null);
  const { setIsSearching } = useContext(GlobalUIContext);

  return (
    <button
      className={`searchbutton card ${className}`}
      onClick={() => setIsSearching(true)}
    >
      <div className="searchbutton__wrap">
        <div
          className="searchbutton__text-input"
          type="search"
          name="quote-search"
          key="random1"
          value={query}
          // placeholder={"Search, Alt+Enter"}
          placeholder={"Search"}
          onChange={(e) => setQuery(e.target.value)}
        >
          Search
        </div>
        <div className="searchbutton__keycombo">
          <div className="searchbutton__key">Alt</div>
          <div className="searchbutton__key">Enter</div>
        </div>
      </div>
    </button>
  );
}
