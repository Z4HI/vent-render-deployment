import mongoose from "mongoose";
import MessageSchema from "./messageSchema.js";

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  friendRequestSent: {
    type: Boolean,
    default: false,
  },
  isFriend: {
    type: Boolean,
    default: false,
  },
  messages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Store references to messages
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
  thankYouSent:{
    type: Boolean,
    default: false,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId, // This stores the reference to the Message object
    ref: "Message", // Ensure it's a reference to the Message model
  },
  responded: {
    type: Boolean,
    default: false,
  },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
