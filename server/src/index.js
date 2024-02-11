import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "../src/routes/routes.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Allow requests only from specific origins (your frontend domains)
const allowedOrigins = [
  "http://localhost:3000", // Add your local development URL
  "https://tictactoe-bieeen16.vercel.app", // Add your production frontend URL
  "https://tictactoe-f3is.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

async function updateDocuments() {
  try {
    const games = await GameData.find();

    for (const game of games) {
      if (!game.createdAt) {
        game.createdAt = new Date();
        await game.save();
      }
    }

    console.log("Documents updated successfully.");
  } catch (error) {
    console.error("Error updating documents:", error);
  } finally {
    mongoose.disconnect();
  }
}

app.use(cors(corsOptions)); // Apply CORS middleware with custom options
app.use(express.json());

const dbURI = process.env.MONGODB_URI;
const port = process.env.PORT || 3001;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

updateDocuments();
app.use("/", routes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
