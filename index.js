const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { storeUser, getUser, getRoomUser, userLeave } = require("./services/users");
const { formatMess } = require("./services/message");

const app = express();
const botName = "Bot";

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("userJoinRoom", ({ username, room }) => {
    socket.join(room);
    io.to(room).emit("serverMessage", formatMess(botName, `Chào mừng <b>${username}</b> vào phòng <b>${room}</b>`));
    storeUser(socket.id, username, room);

    io.to(room).emit("roomUsers", {
      room: room,
      users: getRoomUser(room),
    });
  });

  socket.on("chatMessage", (message) => {
    const user = getUser(socket.id);
    const mesObj = formatMess(user.username, message);
    io.to(user.room).emit("serverMessage", mesObj);
  });

  socket.on("disconnect", () => {
    if (socket.id) {
      const user = userLeave(socket.id);
      if (user && user.room) {
        io.to(user.room).emit("serverMessage", formatMess(botName, `<b>${user.username}</b> đã rời phòng`));

        // Gửi thông tin phòng và danh sách tất cả users trong phòng
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUser(user.room),
        });
      }
    }
  });
});

server.listen(8000, () => {
  console.log(`Server is running`);
});

app.use(express.static(path.join(__dirname, "public")));
