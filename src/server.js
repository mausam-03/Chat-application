import express from "express";
import http from "http";
import { Server } from "socket.io";
import { chatSocket } from "./sockets/chatSocket.js";

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

chatSocket(io);

app.get("/", (req, res) => {
  res.send("Server running");
});

server.listen(3000, () => {
  console.log("Server started");
});

export { io };