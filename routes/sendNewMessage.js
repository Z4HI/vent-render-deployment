import axios from "axios";
import User from "../models/userSchema.js";
import Conversation from "../models/ConversationSchema.js";
import Message from "../models/messageSchema.js";

const sendNewMessage = async (req, res) => {
  const { senderId, senderName, message, conversationID, senderProfileImage } = req.body;



  try {
    let conversation = await Conversation.findById(conversationID); // Find the conversation
    if (senderId.toString() !== conversation.senderId.toString()) {
      conversation.responded = true;
    }
    const recipientId =
      conversation.senderId.toString() === senderId.toString()
        ? conversation.receiverId
        : conversation.senderId;


    const newMessage = new Message({
      senderId: senderId,
      senderName: senderName,
      message: message,
      conversationID: conversationID,
      read: false,
      createdAt: Date.now(),
      receiverId: recipientId,
      senderProfileImage: senderProfileImage,
    });

    const recipient = await User.findById(recipientId);
  
    const recipientExpoPushToken = recipient.expoPushToken;
   
    await newMessage.save();
    conversation.read = false;
    conversation.lastMessage = newMessage;
    conversation.messages.push(newMessage);
    await conversation.save();

    res.status(200).json({ newMessage, expoPushToken: recipientExpoPushToken }); // Respond with the new message
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export default sendNewMessage;
