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

const botName = "Bot";

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
});

io.on("connection", (socket) => {
  const courseId = socket.handshake.query.courseId;
  socket.join(courseId);

  socket.on("sendMessServer", (data) => {
    io.to(courseId).emit("sendMessClient", data);
  });

  socket.on("sendReplyServer", (data) => {
    io.to(courseId).emit("sendReplyClient", data);
  });

});

app.get("/", (req, resp) => resp.send("socket-v1"));

server.listen(8000, () => {
  console.log(`Server is running`);
});

app.use(express.static(path.join(__dirname, "public")));
