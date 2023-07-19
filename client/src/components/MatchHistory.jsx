import React from 'react';

const MatchHistory = ({
  history,
  player1Name,
  player2Name,
  player1Wins,
  player2Wins,
  player1Losses,
  player2Losses,
  player1Draws,
  player2Draws,
}) => {
  return (
    <aside className="bg-gray-100 p-4 mt-4 rounded">
      <h2 className="text-xl font-bold mb-4">Match History</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((match, index) => (
            <li key={index} className="mb-2">
              <span className="font-bold">Match {index + 1}: </span>
              {match}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches played yet.</p>
      )}
      <div className="flex flex-col mt-4">
        <div>
          <span className="font-bold text-red-600 mr-2">{player1Name}:</span>
          <span>
            {player1Wins} wins, {player1Losses} losses, {player1Draws} draws
          </span>
        </div>
        <div>
          <span className="font-bold text-blue-600 mr-2">{player2Name}:</span>
          <span>
            {player2Wins} wins, {player2Losses} losses, {player2Draws} draws
          </span>
        </div>
      </div>
    </aside>
  );
};

export default MatchHistory;
