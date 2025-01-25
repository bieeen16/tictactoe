export const GAME_STATES = {
  INITIAL: "INITIAL",
  PLAYING: "PLAYING",
  FINISHED: "FINISHED",
};

export const PLAYER_SYMBOLS = {
  PLAYER1: "X",
  PLAYER2: "O",
};

export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
