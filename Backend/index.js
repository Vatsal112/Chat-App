const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const ChatModel = require("./DB/chatSchema");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Database connection
mongoose.connect("mongodb://localhost:27017/ChatApp", {
  autoIndex: true,
});

//Handling CORS
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
  })
);

//Global variable for handling online users
let onlineUsers = [];

//To Pass Body into the JSON
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

io.on("connection", (socket) => {
  console.log("User connected!!");

  //Finding Top 10 messages from the DB and Sending them to the Client
  ChatModel.find()
    .sort({ timestamp: -1 })
    .limit(10)
    .then((messages) => {
      socket.emit("chat-history", messages.reverse());
    });

  //Handling New Messages
  socket.on("send-message", async ({ username, message }) => {
    const msg = new ChatModel({ username, message });
    await msg.save();

    io.to(123).emit("message", { username, message });
  });

  //Handling joining new users
  socket.on("join", (username) => {
    socket.username = username;
    onlineUsers.push(username);
    socket.join(123);

    io.to(123).emit("online-users", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user !== socket.username);
    io.emit("online-users", onlineUsers);
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
