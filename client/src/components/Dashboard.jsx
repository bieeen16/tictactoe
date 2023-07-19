import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/?page=${currentPage}`
        );
        setGames(response.data.games);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error retrieving games:', error);
      }
    };

    fetchGames();
  }, [currentPage]);

  const handleNewGame = () => {
    navigate('/match-history/');
  };

  const handleMatchClick = (gameId) => {
    navigate(`/match-history/${gameId}`);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`${
            i === currentPage ? 'bg-blue-500 text-white' : 'bg-white'
          } rounded-full w-8 h-8 flex items-center justify-center cursor-pointer mx-1`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">TIC TAC TOE</h1>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleNewGame}
      >
        New Game
      </button>
      <h3 className="text-lg font-bold mt-4">Games:</h3>
      {games.length > 0 ? (
        <div>
          <ul className="mt-2">
            {games.map((game) => (
              <li
                key={game._id}
                className="bg-white rounded shadow-md py-2 px-4 mt-2"
              >
                <a
                  href={game._id}
                  onClick={() => handleMatchClick(game._id)}
                  className="text-blue-500 hover:underline"
                >
                  {game.player1Name} VS {game.player2Name}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              Previous Page
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Next Page
            </button>
          </div>
          <ul className="flex justify-center mt-4">
            {renderPageNumbers()}
          </ul>
        </div>
        
      ) : (
        <p className="mt-2">No games found.</p>
      )}
    </div>
  );
};

export default Dashboard;
