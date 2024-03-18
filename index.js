const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const server = http.createServer(app);
const io = socketio(server, {
  maxHttpBufferSize: 2e8,
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
});

io.on("connection", (socket) => {
  const courseId = socket.handshake.query.courseId;
  const site = socket.handshake.query.site;

  if (courseId) {
    const room = courseId + site;
    socket.join(room);

    socket.on("sendMessServer", (data) => {
      io.to(room).emit("sendMessClient", data);
    });

    socket.on("sendReplyServer", (data) => {
      io.to(room).emit("sendReplyClient", data);
    });

    socket.on("replyResServer", (id) => {
      io.to(room).emit("replyResClient", id);
    });
  }

  socket.on("actionSocketPush", (data) => {
    io.emit("actionClient", data);
  });

  socket.on("actionSocketPull", (data) => {
    io.emit("actionPhp", data);
  });
});

app.get("/", (req, resp) => resp.send("socket-v1"));

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running`);
});
