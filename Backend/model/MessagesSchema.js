// models/chat.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  sender: { type: String, required: true }, // "admin" or "customer"
  receiver: { type: String, required: true }, // User ID for the receiver
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  chat_id: { type: String, required: true },
  chat_name: { type: String, required: true },
  messages: [messageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

const Chat = model("Chat", chatSchema);

export default Chat;
