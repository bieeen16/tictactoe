import React from 'react';
import { useNavigate } from 'react-router-dom';

const MatchDetails = ({
  matchData,
  player1Name,
  player2Name,
  p1Wins,
  p2Wins,
  p1Losses,
  p2Losses,
  p1Draws,
  p2Draws,
}) => {
  const navigate = useNavigate();
  const backToDashboard = () => {
    navigate('/');
  };


  return (
    <aside className="bg-gray-100 p-4 mt-4 rounded">
      <h2 className="text-xl font-bold mb-4">Match History</h2>
      {matchData && matchData.length > 0 ? (
        <div>
          {matchData[0].matchNumber.map((matchNumber, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">Match {matchNumber}: </span>
              {matchData[0].matchHistory[index]}
            </div>
          ))}
        </div>
      ) : (
        <p>No matches played yet.</p>
      )}
      <div className="flex flex-col mt-4">
        <div>
          <span className="font-bold text-red-600 mr-2">{player1Name}:</span>
          <span>
            {p1Wins} wins, {p1Losses} losses, {p1Draws} draws
          </span>
        </div>
        <div>
          <span className="font-bold text-blue-600 mr-2">{player2Name}:</span>
          <span>
            {p2Wins} wins, {p2Losses} losses, {p2Draws} draws
          </span>
        </div>
      </div>
      <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={backToDashboard}
            >
              Back
            </button>
    </aside>
  );
};

export default MatchDetails;
