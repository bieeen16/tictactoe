import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "./config";

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/?page=${currentPage}&sort=-createdAt`
        );
        setGames(response.data.games);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError("Failed to load games. Please try again.");
        console.error("Error retrieving games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [currentPage]);

  const handleNewGame = () => {
    navigate("/match/");
  };
  const handleNewGameAI = () => {
    navigate("/match-ai");
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
            i === currentPage ? "bg-blue-500 text-white" : "bg-white"
          } rounded-full w-8 h-8 flex items-center justify-center cursor-pointer mx-1`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/rooms`);
      navigate(`/room/${response.data.roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 ">
        TIC <span className="text-[#DC2625]">TAC </span>{" "}
        <span className="text-[#3B81F6]"> TOE</span>
      </h1>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 mx-2 px-4 rounded"
        onClick={handleNewGameAI}
      >
        Play With AI
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleNewGame}
      >
        Multiplayer
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
                <Link
                  to={`/match-history/${game._id}`}
                  className="text-blue-500 hover:underline"
                >
                  {game.player1Name} VS {game.player2Name}
                </Link>
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
          <ul className="flex justify-center mt-4">{renderPageNumbers()}</ul>
        </div>
      ) : (
        <p className="mt-2">No games found.</p>
      )}
      <div className="mt-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => setShowCreateRoom(true)}
        >
          Create Multiplayer Room
        </button>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            className="border rounded px-2 py-1"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
