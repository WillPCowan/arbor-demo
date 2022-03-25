import React from "react";

import Searchbutton from "./Searchbutton";
import UserPortal from "./UserPortal";
import Logo from "./Logo";
// Styling
import "../styles/Header.scss";

/**
 * @param {*} props
 * @returns A navbar component with interfaces for search and user functions.
 */
export default function Header(props) {
  return (
    <div className="header">
      <Logo />
      <div className="header__group-r">
        <UserPortal />
        <Searchbutton />
      </div>
    </div>
  );
}
