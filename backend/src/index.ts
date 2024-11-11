import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { createServer } from "http";
import { initHttp } from "./http";
import cors from "cors";
import { initWs } from "./ws";
import mongoose from "mongoose";

const app = express();
app.use(cors());
const mongoUrl: string = process.env.mongoUrl || "mongo_url";
const connect = async () => {
  await mongoose.connect(mongoUrl);
};
const httpServer = createServer(app);
initWs(httpServer);
initHttp(app);

const port = process.env.PORT || 3001;
httpServer.listen(port, async() => {
  console.log(`listening on *:${port}`);
  await connect();
  console.log("Connected to mongoDB");
});