const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors());

const router = require('./router');
app.use(router);

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server,{
  cors: {
    origin: "https://chat-app-beta-weld.vercel.app/"
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    socket.emit("Disconnected",socket.id)
  });
});

server.listen(PORT, () => {
  console.log(`SERVER RUNNING on port ${PORT}`);
});  