import React, { useContext } from "react";
import { UserContext } from "../lib/contexts";

/**
 * @param {*} props
 * @returns
 */
export default function UserPortal(props) {
  // state and logic
  const user = useContext(UserContext);

  return (
    <div className="userportal">
      {user ? (
        <img src={user?.photoURL} />
      ) : (
        <button className="btn-login btn-grey">Log in</button>
      )}
    </div>
  );
}
