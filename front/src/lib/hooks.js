import React, { useState, useEffect } from "react";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const { user, loading, error } = useAuthState();

  // User doc subscription would occur here
  // if (user) {
  //   setUsername(user.username);
  // } else {
  //   setUsername(null);
  // }

  // Return
  return user;
}

// TEMP MOCK DATA
async function useAuthState() {
  const user = {
    id: 1,
    username: "willpcowan",
    photoURL:
      "https://whatsapplover.com/wp-content/uploads/2021/07/Funny-Profile-Pictures.jpg",
  };

  return { user, loading: null, error: null };
}

// HOTKEY HOOKS ---------------------------------------------------------------
export function useOnKeyDown(targetKey, handler) {
  function handleOnKeyDown(e) {
    if (e.key === targetKey) {
      handler(e);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown);
    return () => {
      window.removeEventListener("keydown", handleOnKeyDown);
    };
  });
}

export function useOnAltKeyComboDown(targetKey, handler) {
  function handleOnKeyDown(e) {
    if (e.altKey && e.key === targetKey) {
      handler(e);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown);
    return () => {
      window.removeEventListener("keydown", handleOnKeyDown);
    };
  });
}
