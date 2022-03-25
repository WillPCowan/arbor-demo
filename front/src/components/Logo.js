import React from "react";
import Link from "../routing/Link";

export default function Logo(props) {
  return (
    <h1 className="logo">
      <Link to="/">Arbor</Link>
    </h1>
  );
}
