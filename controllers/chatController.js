const User = require("../models/userModel");
// const Chat = require('../models/chatModel');

const setOnline = async (socket) => {
  try {
    const { userId } = socket.handshake.auth;
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          is_online: 1,
        },
      }
    );
    socket.broadcast.emit('userOnline',{
        userId
    })
  } catch (error) {
    console.log(error.message);
  }
};
const setOffline = async (socket) => {
  try {
    const {userId} = socket.handshake.auth;
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          is_online: 0,
        },
      }
    );
    socket.broadcast.emit('userOffline',{
        userId
    })
  } catch (error) {
    console.log(error.message);
  }
};
const newChat = async(socket,data)=>{
  try {
    socket.broadcast.emit('loadNewChat',data)
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  setOnline,
  setOffline,
  newChat,

};
