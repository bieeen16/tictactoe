import { createContext, useReducer } from "react";

export const GameContext = createContext();

const gameReducer = (state, action) => {
  switch (action.type) {
    case "MAKE_MOVE":
    case "RESET_GAME":
    case "UPDATE_SCORES":
    // Add more cases
  }
};
