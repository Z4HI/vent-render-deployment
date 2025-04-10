import Conversation from "../models/ConversationSchema.js";
import User from "../models/userSchema.js";
import badge from "../helper/badgeSystem.js";
const updateThankYouStatus = async (req, res) => {
    const { conversationId, userId } = req.body;
    const conversation = await Conversation.findById(conversationId);
    conversation.thankYouSent = true;
    await conversation.save();
    const user = await User.findById(userId);
    user.VentCoins += 50;
    user.helpedCount += 1;
    await user.save();
    res.status(200).json({ message: "Thank you status updated" });
};

export default updateThankYouStatus;