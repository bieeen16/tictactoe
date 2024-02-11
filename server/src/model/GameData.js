import mongoose from "mongoose";

const gameDataSchema = new mongoose.Schema(
  {
    matchData: [
      {
        matchNumber: [{ type: String, required: true }],
        matchHistory: [{ type: String, required: true }],
      },
    ],
    player1Name: { type: String, required: true },
    player2Name: { type: String, required: true },
    p1Wins: { type: Number, required: true },
    p2Wins: { type: Number, required: true },
    p1Losses: { type: Number, required: true },
    p2Losses: { type: Number, required: true },
    p1Draws: { type: Number, required: true },
    p2Draws: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const GameData = mongoose.model("GameData", gameDataSchema);

export default GameData;
