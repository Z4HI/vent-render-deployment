import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  message: {
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
  conversationID: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference the Conversation model
    ref: "Conversation", // Reference to the Conversation document
    required: false, // Make it required to link the message to a conversation
  },
  read: {
    type: Boolean,
    default: false, // Initially set to false when the message is unread
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  senderProfileImage: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
