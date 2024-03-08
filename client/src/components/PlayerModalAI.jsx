// PlayerModalAI.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlayerModalAI = ({ isOpen, onClose, onNamesSubmit }) => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const backToDashboard = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNamesSubmit(playerName, "Computer (AI)");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="playerName"
            >
              Your Name:
            </label>
            <input
              className="border border-gray-300 p-2 w-full"
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center space-x-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              type="submit"
            >
              Start Game
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={backToDashboard}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerModalAI;
