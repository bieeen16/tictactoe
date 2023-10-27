import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "../src/routes/routes.js";

const app = express();

// Allow requests only from specific origins (your frontend domains)
const allowedOrigins = [
  "https://tictactoe-bieeen16.vercel.app/", // Add your local development URL
  "https://tictactoe-f3is.onrender.com/", // Add your production frontend URL
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

app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS middleware with custom options

mongoose
  .connect(
    "mongodb+srv://bienx16:bKE0ga4yYECqia9r@cluster0.lrfxusf.mongodb.net/Cluster0?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());

app.use("/", routes);

app.listen(3001, () => console.log("Server is running!"));
