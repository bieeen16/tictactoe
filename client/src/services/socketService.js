import io from "socket.io-client";
import API_BASE_URL from "../components/config";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(API_BASE_URL);

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }

  joinRoom(roomId, player) {
    this.socket.emit("join_room", { roomId, player });
  }

  leaveRoom(roomId) {
    this.socket.emit("leave_room", roomId);
  }

  makeMove(roomId, move) {
    this.socket.emit("make_move", { roomId, move });
  }

  onPlayerJoined(callback) {
    this.socket.on("player_joined", callback);
  }

  onPlayerLeft(callback) {
    this.socket.on("player_left", callback);
  }

  onMoveMade(callback) {
    this.socket.on("move_made", callback);
  }

  onGameChat(callback) {
    this.socket.on("chat_message", callback);
  }

  sendChatMessage(roomId, message) {
    this.socket.emit("chat_message", { roomId, message });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
