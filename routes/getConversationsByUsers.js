import Conversation from "../models/ConversationSchema.js";
import Message from "../models/messageSchema.js";

const getConversationsByUsers = async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    // Find conversations where either user is the sender and the other is the receiver
    const conversations = await Conversation.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: -1 });

    // Populate messages for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const messages = await Message.find({
          conversationID: conversation._id
        }).sort({ createdAt: 1 });
        
        return {
          ...conversation.toObject(),
          messages
        };
      })
    );

    return res.status(200).json({
      success: true,
      conversations: conversationsWithMessages
    });

  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message
    });
  }
};

export default getConversationsByUsers; 