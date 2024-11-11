import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Player } from "./types";



export const initWs = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",  // Adjust as needed
      methods: ["GET", "POST"],
    },
  });

  const players = new Map<string, Player>();

  io.on("connection", (socket: Socket) => {
    console.log("Player connected:", socket.id);

    // Handle new player joining
    socket.on("player-join", (data: { name?: string }) => {
      const player: Player = {
        id: socket.id,
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        direction: "front",
        name: data.name || `Player ${players.size + 1}`,
      };

      players.set(socket.id, player);

      // Send existing players to new player
      socket.emit("players-sync", Array.from(players.values()));

      // Broadcast new player to others
      socket.broadcast.emit("player-joined", player);
    });

    // Handle player movement
    socket.on("player-move", (data: { x: number; y: number; direction: string }) => {
      const player = players.get(socket.id);
      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.direction = data.direction;

        // Broadcast player movement to others
        socket.broadcast.emit("player-moved", player);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
      players.delete(socket.id);
      io.emit("player-left", socket.id);
    });
  });
};
