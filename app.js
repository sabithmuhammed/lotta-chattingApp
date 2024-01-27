require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const { authentication } = require("./middlewares/authentication");
const { database_connection, port } = process.env;
mongoose.connect(database_connection + "lotta");

const express = require("express");

const chatController = require("./controllers/chatController");

const app = express();
const server = app.listen(port, () =>
  console.log(`server is running on port ${port}`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authentication);
app.use(morgan("tiny"));
app.set("view engine", "ejs");
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));
app.use("/", userRoutes);

const io = require("socket.io")(server);
const user = io.of("/user-namespace");
user.on("connection", (socket) => {
  chatController.setOnline(socket);
  socket.on("disconnect", () => {
    chatController.setOffline(socket);
    console.log("user disconnected");
  });
  socket.on('newMessage',(data)=>{
    chatController.newChat(socket,data)
  })
});
