import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "../src/routes/routes.js";

const app = express();

app.use(express.json());
app.use(cors());

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

app.listen(3001, () => console.log("server is running!"));
