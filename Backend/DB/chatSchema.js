const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChatSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: { type: Date, default: Date.now() },
});

const ChatModel = mongoose.model("ChatModel", ChatSchema);

module.exports = ChatModel;
