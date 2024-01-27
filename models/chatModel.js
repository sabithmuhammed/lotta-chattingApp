const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    message:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchema);
