import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayerModalAI from "./PlayerModalAI";
import MatchHistory from "./MatchHistory";
import axios from "axios";
import API_BASE_URL from "./config";

const GameAI = () => {
  const navigate = useNavigate();
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [winner, setWinner] = useState(null);
  const [rollingDice, setRollingDice] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("Computer");
  const [modalOpen, setModalOpen] = useState(true);
  const [matchHistory, setMatchHistory] = useState([]);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [player1Losses, setPlayer1Losses] = useState(0);
  const [player2Losses, setPlayer2Losses] = useState(0);
  const [player1Draws, setPlayer1Draws] = useState(0);
  const [player2Draws, setPlayer2Draws] = useState(0);
  const [matchNumber, setMatchNumber] = useState([]);

  useEffect(() => {
    if (showGame) {
      const timer = setTimeout(() => {
        setRollingDice(false);
        if (!isPlayer1) {
          // Computer's turn
          handleComputerMove();
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [showGame, isPlayer1]);

  const handleRollDice = () => {
    setRollingDice(true);
    setShowGame(false);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 2) + 1;
      setDiceResult(result === 1 ? player1Name : player2Name);
      setIsPlayer1(result === 1);
      setShowGame(true);
    }, 2000);
  };

  const handleComputerMove = () => {
    // Simple AI logic: Prioritize winning, blocking, and random move
    const winningMove = findWinningMove();
    const blockingMove = findBlockingMove();

    if (winningMove !== null) {
      handleCellClick(winningMove);
    } else if (blockingMove !== null) {
      handleCellClick(blockingMove);
    } else {
      // If no winning or blocking move, choose a random empty cell
      const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === null) {
          acc.push(index);
        }
        return acc;
      }, []);

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        handleCellClick(emptyCells[randomIndex]);
      }
    }
  };

  const findWinningMove = () => {
    // Check for a winning move for the computer
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = "O";
        if (checkWin(newBoard, "O")) {
          return i;
        }
      }
    }
    return null;
  };

  const findBlockingMove = () => {
    // Check for a blocking move to prevent player from winning
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = "X";
        if (checkWin(newBoard, "X")) {
          return i;
        }
      }
    }
    return null;
  };

  const checkWin = (currentBoard, player) => {
    // Helper function to check for a win
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return true;
      }
    }
    return false;
  };

  const handleCellClick = (index) => {
    if (board[index] !== null || winner) return;

    const newBoard = [...board];
    newBoard[index] = isPlayer1 ? "X" : "O";
    setBoard(newBoard);
    setIsPlayer1(!isPlayer1);

    checkWinner(newBoard);
  };

  const checkWinner = (currentBoard) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        setWinner(currentBoard[a]);
        updateScores(currentBoard[a]);
        return;
      }
    }

    if (currentBoard.every((cell) => cell !== null)) {
      setWinner("Draw");
      updateScores("Draw");
    }
  };

  const renderCell = (index) => {
    return (
      <div
        className={`border border-gray-300 w-12 h-12 flex items-center justify-center text-2xl cursor-pointer ${
          !isPlayer1 ? "pointer-events-none" : "" // Disable clicks during computer AI's turn
        }`}
        onClick={() => handleCellClick(index)}
      >
        {board[index]}
      </div>
    );
  };

  const renderWinnerMessage = () => {
    if (winner === "Draw") {
      return <div className="text-lg mt-4">It's a draw!</div>;
    } else if (winner) {
      return (
        <div className="text-lg mt-4">
          {winner === "X"
            ? `Player 1 : ${player1Name} (X)`
            : `Player 2 ${player2Name} (O)`}{" "}
          wins!
        </div>
      );
    } else {
      return (
        <div className="text-xl mb-4">
          <div className="flex justify-center">
            <p className="text-red-600 mx-2">{player1Wins}</p>|
            <p className="text-blue-600 mx-2">{player2Wins}</p>
          </div>
          <div className="font-bold">Your Turn : </div>
          {isPlayer1 ? (
            <span style={{ color: "#DC2625" }}>{`${player1Name} (X)`}</span>
          ) : (
            <span style={{ color: "#3B81F6" }}>{`${player2Name} (O)`}</span>
          )}
        </div>
      );
    }
  };

  const resetGame = () => {
    if (winner) {
      let result;

      if (winner === "Draw") {
        result = "Draw";
      } else if (winner === "X") {
        result = player1Name;
      } else if (winner === "O") {
        result = player2Name;
      }

      if (result === "Draw") {
        setIsPlayer1(!isPlayer1);
      } else {
        setIsPlayer1(result === player1Name);
      }

      setBoard(initialBoard);
    }
    setWinner(null);
  };

  const handleNamesSubmit = (name1, name2) => {
    setPlayer1Name(name1);
    setPlayer2Name(name2);
    setModalOpen(false);
    setTimeout(() => {
      setRollingDice(false);
    });
  };

  const updateScores = (winner) => {
    const matchResult =
      winner === "Draw"
        ? "Draw!"
        : winner === "X"
        ? `${player1Name} wins`
        : `${player2Name} wins`;

    setMatchHistory((prevHistory) => [...prevHistory, matchResult]);
    setMatchNumber((prevMatchNumber) => [
      ...prevMatchNumber,
      prevMatchNumber.length + 1,
    ]);

    if (winner === "X") {
      setPlayer1Wins(player1Wins + 1);
      setPlayer2Losses(player2Losses + 1);
    } else if (winner === "O") {
      setPlayer2Wins(player2Wins + 1);
      setPlayer1Losses(player1Losses + 1);
    } else {
      setPlayer1Draws(player1Draws + 1);
      setPlayer2Draws(player2Draws + 1);
    }
  };

  const saveMatchHistory = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/match-history/`, {
        matchData: [
          {
            matchNumber,
            matchHistory,
          },
        ],
        player1Name,
        player2Name,
        p1Wins: player1Wins,
        p2Wins: player2Wins,
        p1Losses: player1Losses,
        p2Losses: player2Losses,
        p1Draws: player1Draws,
        p2Draws: player2Draws,
      });

      if (response.status === 200) {
        console.log("Match history saved successfully!");
        alert("Game Data Saved!");
        navigate("/");
      } else {
        console.log("Failed to save match history.");
        alert("Failed");
      }
    } catch (error) {
      console.error("Error saving match history:", error);
      alert("Error saving match history");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {modalOpen && (
        <PlayerModalAI
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onNamesSubmit={handleNamesSubmit}
        />
      )}
      <div className="flex items-center text-xl font-bold mb-4">
        {player1Name && player2Name && (
          <>
            <p className="text-red-600 mx-2">{player1Name} </p>
            VS
            <p className="text-blue-600 mx-2">{player2Name} </p>
          </>
        )}
      </div>
      {rollingDice ? (
        <div className="text-3xl font-bold text-center">
          Rolling Dice: {diceResult !== null ? diceResult : "..."}
        </div>
      ) : showGame ? (
        <>
          {renderWinnerMessage()}
          <div className="grid grid-cols-3 gap-4">
            {board.map((cell, index) => (
              <React.Fragment key={index}>{renderCell(index)}</React.Fragment>
            ))}
          </div>
          {winner && (
            <div>
              <button
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={() => {
                  resetGame();
                }}
              >
                Play Again
              </button>
              <br />
              <button
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={saveMatchHistory}
              >
                Save and Go to Dashboard
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
          onClick={handleRollDice}
        >
          Roll Dice
        </button>
      )}
      <div>
        <MatchHistory
          history={matchHistory}
          player1Name={player1Name}
          player2Name={player2Name}
          player1Wins={player1Wins}
          player2Wins={player2Wins}
          player1Losses={player1Losses}
          player2Losses={player2Losses}
          player1Draws={player1Draws}
          player2Draws={player2Draws}
        />
      </div>
    </div>
  );
};

export default GameAI;
