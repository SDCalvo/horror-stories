// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";
import storyRoute from "./routes/storyRoute.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/story", storyRoute);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
