import Message from "../models/messageSchema.js";
import ConversationSchema from "../models/ConversationSchema.js";
import mongoose from "mongoose";
const getMessages = async (req, res) => {
  const { conversationID, userID, limit = 10, skip = 0 } = req.query;
  const Conversation = ConversationSchema;
  try {
    const messageObjectId = new mongoose.Types.ObjectId(conversationID);
    const messages = await Message.find({
      conversationID: messageObjectId,
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(parseInt(skip))
    .limit(parseInt(limit));

    const totalMessages = await Message.countDocuments({
      conversationID: messageObjectId,
    });

    if (!messages.length) {
      return res.status(200).json({
        success: true,
        messages: [],
        hasMore: false,
        totalMessages: 0
      });
    }

    const conversation = await Conversation.findById(conversationID).populate(
      "lastMessage"
    );
    if (
      conversation &&
      conversation.lastMessage.senderId?.toString() !== userID
    ) {
      conversation.read = true;
      await conversation.save();
    }

    return res.status(200).json({
      success: true,
      messages: messages.reverse(), // Reverse to show oldest first
      hasMore: parseInt(skip) + messages.length < totalMessages,
      totalMessages
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export default getMessages;
