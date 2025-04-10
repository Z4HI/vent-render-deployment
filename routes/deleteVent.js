import Conversation from "../models/ConversationSchema.js";
import Message from "../models/messageSchema.js";
import User from "../models/userSchema.js";

const deleteMessage = async (req, res) => {
  const { conversationID, userID } = req.body;

  try {
    await User.updateMany(
      { previousMessages: conversationID },
      { $pull: { previousMessages: conversationID } }
    );
    await Message.deleteMany({ conversationID });
    await User.updateOne(
      { _id: userID },
      { $pull: { previousMessages: conversationID } }
    );

    const deleteConversation = await Conversation.findByIdAndDelete(
      conversationID
    );

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default deleteMessage;
