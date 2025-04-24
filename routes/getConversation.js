import Conversation from "../models/ConversationSchema.js";
import Message from "../models/messageSchema.js";

const getConversation = async (req, res) => {
  const { conversationId } = req.query;

  try {
    const conversation = await Conversation.findById(conversationId)
      .populate('lastMessage')
      .exec();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    return res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
      error: error.message
    });
  }
};

export default getConversation; 