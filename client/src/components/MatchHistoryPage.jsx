import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatchDetails from './MatchDetails';
import { useParams } from 'react-router-dom';
import API_BASE_URL from './config';

const MatchHistoryPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${gameId}`);
        setGame(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGame();
  }, [gameId]);

  if (!gameId) {
    return <p>No match details available.</p>;
  }

  if (error) {
    return <p>Error retrieving match details: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {game ? (
        <MatchDetails
          matchData={game.matchData}
          player1Name={game.player1Name}
          player2Name={game.player2Name}
          p1Wins={game.p1Wins}
          p2Wins={game.p2Wins}
          p1Losses={game.p1Losses}
          p2Losses={game.p2Losses}
          p1Draws={game.p1Draws}
          p2Draws={game.p2Draws}
        />
      ) : (
        <p>Loading match details...</p>
      )}
    </div>
  );
};

export default MatchHistoryPage;
