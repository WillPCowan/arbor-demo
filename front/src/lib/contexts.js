import { createContext } from "react";

export const UserContext = createContext({
  id: null,
  username: null,
  photoURL: null,
});

export const GlobalUIContext = createContext({
  isSearching: false,
  setIsSearching: (search) => {},
});
