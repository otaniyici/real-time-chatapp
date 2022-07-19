const path = require("path");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const socketio = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/userModel");

// impot utils
const userUtil = require("./utils/userUtil");
const messageUtil = require("./utils/messageUtil");

//Make DB connection
const DB_URL = process.env.DB_URL.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(morgan("dev"));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chatcord Bot";

// Run when client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ username, room }) => {
    const user = await userUtil.userJoin(username, room);

    socket.join(user.room);
    socket.username = username;

    // Welcome current user
    socket.emit(
      "message",
      await messageUtil.formatMessage(botName, "Welcome to ChatCord!")
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        await messageUtil.formatMessage(
          botName,
          `${user.username} has joined the chat`
        ),
        await userUtil.getRoomUsers(user.room)
      );

    //Sends users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: await userUtil.getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", async (msg, { username, room }) => {
    const user = await User.findOne({ username });

    io.to(user.room).emit(
      "message",
      await messageUtil.formatMessage(user.username, msg)
    );
  });

  // Runs when client disconnects
  socket.on("disconnect", async () => {
    const user = await User.findOne({ username: socket.username });
    user.active = false;
    await user.save();
    if (user) {
      io.to(user.room).emit(
        "message",
        await messageUtil.formatMessage(
          botName,
          `${user.username} has left the chat`
        )
      );
      //Sends users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: await userUtil.getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
