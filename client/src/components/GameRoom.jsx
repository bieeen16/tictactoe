import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socketService from "../services/socketService";
import Game from "./Game";
import Chat from "./Chat";

const GameRoom = () => {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to socket when component mounts
    socketService.connect();

    // Join the room
    socketService.joinRoom(roomId, {
      name: localStorage.getItem("playerName"),
      id: localStorage.getItem("playerId"),
    });

    // Socket event listeners
    socketService.onPlayerJoined((data) => {
      setPlayers(data.players);
      setSpectators(data.spectators);
    });

    socketService.onPlayerLeft((data) => {
      setPlayers(data.players);
      setSpectators(data.spectators);
    });

    socketService.onGameChat((message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveRoom(roomId);
      socketService.disconnect();
    };
  }, [roomId]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1">
        <Game isMultiplayer={true} roomId={roomId} players={players} />
      </div>
      <div className="w-full md:w-64">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-bold mb-2">Players</h3>
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  player.active ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span>{player.name}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-bold mb-2">Spectators ({spectators.length})</h3>
          {spectators.map((spectator) => (
            <div key={spectator.id}>{spectator.name}</div>
          ))}
        </div>
        <Chat
          messages={messages}
          onSendMessage={(message) => {
            socketService.sendChatMessage(roomId, message);
          }}
        />
      </div>
    </div>
  );
};

export default GameRoom;
