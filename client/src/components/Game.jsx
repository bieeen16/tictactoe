import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerModal from './PlayerModal';
import MatchHistory from './MatchHistory';
import axios from 'axios';

const Game = () => {
  const navigate = useNavigate();
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [winner, setWinner] = useState(null);
  const [rollingDice, setRollingDice] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
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
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showGame]);

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

  const handleCellClick = (index) => {
    if (board[index] !== null || winner) return;

    const newBoard = [...board];
    newBoard[index] = isPlayer1 ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayer1(!isPlayer1);

    checkWinner(newBoard);
  };

  const checkWinner = (currentBoard) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        setWinner(currentBoard[a]);
        const winnerName = currentBoard[a] === 'X' ? player1Name : player2Name;
        const matchResult = `${winnerName} wins`;
        setMatchHistory((prevHistory) => [...prevHistory, matchResult]);
        setMatchNumber((prevMatchNumber) => [...prevMatchNumber, prevMatchNumber.length + 1]);
        updateScores(currentBoard[a]);
        return;
      }
    }

    if (currentBoard.every((cell) => cell !== null)) {
      setWinner('Draw');
      const matchResult = 'Draw!';
      setMatchHistory((prevHistory) => [...prevHistory, matchResult]);
      ssetMatchNumber((prevMatchNumber) => [...prevMatchNumber, prevMatchNumber.length + 1]);
      updateScores('Draw');
    }
  };

  const renderCell = (index) => {
    return (
      <div
        className="border border-gray-300 w-12 h-12 flex items-center justify-center text-2xl cursor-pointer"
        onClick={() => handleCellClick(index)}
      >
        {board[index]}
      </div>
    );
  };

  const renderWinnerMessage = () => {
    if (winner === 'Draw') {
      return <div className="text-lg mt-4">It's a draw!</div>;
    } else if (winner) {
      return (
        <div className="text-lg mt-4">
          {winner === 'X' ? `Player 1 : ${player1Name} (X)` : `Player 2 ${player2Name} (O)`} wins!
        </div>
      );
    } else {
      return (
        <div className="text-xl mb-4">
          <div className="flex justify-center">
            <p className="text-red-600 mx-2">{player1Wins}</p>|
            <p className="text-blue-600 mx-2">{player2Wins}</p>
          </div>
          <div className="font-bold">Your Turn : </div>{isPlayer1 ? `${player1Name} (X)` : `${player2Name} (O)`}
        </div>
      );
    }
  };

  const resetGame = () => {
    if (winner) {
      let result;

      if (winner === 'Draw') {
        result = 'Draw';
      } else if (winner === 'X') {
        result = player1Name
      } else if (winner === 'O') {
        result = player2Name
      }

      if (result === 'Draw') {
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
    if (winner === 'X') {
      setPlayer1Wins(player1Wins + 1);
      setPlayer2Losses(player2Losses + 1);
    } else if (winner === 'O') {
      setPlayer2Wins(player2Wins + 1);
      setPlayer1Losses(player1Losses + 1);
    } else {
      setPlayer1Draws(player1Draws + 1);
      setPlayer2Draws(player2Draws + 1);
    }
  };

  const saveMatchHistory = async () => {
    try {

      const response = await axios.post("https://tictactoe-f3is.onrender.com/match-history/", {
        
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
        console.log('Match history saved successfully!');
        alert("Game Data Saved!");
        navigate('/');
      } else {
        console.log('Failed to save match history.');
        alert("Failed");
      }
    } catch (error) {
      console.error('Error saving match history:', error);
      alert("Error saving match history");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {modalOpen && (
        <PlayerModal
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
          Rolling Dice: {diceResult !== null ? diceResult : '...'}
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
                onClick={
                  saveMatchHistory
                }
              >
                Save and Go to Dashboard
              </button>
            </div>
          )}
        </>
      ) : (
        <button className="bg-blue-500 text-white py-2 px-4 mt-4 rounded" onClick={handleRollDice}>
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

export default Game;
