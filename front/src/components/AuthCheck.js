/**
 * A component that only renders its children if user is authenticated,
 * otherwise the user is redirected to enter.js (sign-in page)
 *
 * BONUS: components inside are garaunteed to have access to user and its context
 *        -> less conditional statements
 */
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
