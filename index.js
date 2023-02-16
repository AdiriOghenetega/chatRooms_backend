const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const router = require('./router');
const { Server } = require("socket.io");

const app = express();
app.use(cors());

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use(router);

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server,{
  cors: {
    origin: "https://chat-app-beta-weld.vercel.app"
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