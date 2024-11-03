import {Server,Socket} from "socket.io"
import {Server as HttpServer} from "http"

export const initWs = (httpServer:HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", async(socket:Socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}