const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json()); // for body parser
app.use(morgan("dev"));
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5500",
    credentials: true,
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (data) => {
    console.log(data);
    users[socket.id] = {
      name: data.name,
      room: data.room,
    };
    socket.broadcast.emit("user-connected", users[socket.id]);
  });
  socket.on("send-chat-message", (data) => {
    socket.broadcast.emit("chat-message", {
      message: data.message,
      name: users[socket.id].name,
      room: data.room,
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
http.listen(process.env.PORT, () => console.log(`${process.env.PORT}`));
