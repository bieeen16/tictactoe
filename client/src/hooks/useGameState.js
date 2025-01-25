// Custom hook for managing game state
import { useState, useCallback } from "react";

export const useGameState = (initialState) => {
  const [board, setBoard] = useState(initialState);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [winner, setWinner] = useState(null);

  const makeMove = useCallback(
    (index) => {
      if (board[index] || winner) return false;

      const newBoard = [...board];
      newBoard[index] = isPlayer1Turn ? "X" : "O";
      setBoard(newBoard);
      setIsPlayer1Turn(!isPlayer1Turn);

      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
      }

      return true;
    },
    [board, isPlayer1Turn, winner]
  );

  return {
    board,
    isPlayer1Turn,
    winner,
    makeMove,
    resetGame: () => {
      setBoard(initialState);
      setIsPlayer1Turn(true);
      setWinner(null);
    },
  };
};
