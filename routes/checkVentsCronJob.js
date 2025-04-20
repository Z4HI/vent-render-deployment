import Conversation from '../models/ConversationSchema.js';
import Message from '../models/messageSchema.js';
import User from '../models/userSchema.js';
import { connectToDatabase } from '../db/mongodb.js';

const checkVents = async () => {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Find all conversations that have expired
    const expiredConversations = await Conversation.find({
      expiresAt: { $lte: new Date() }
    });

    // For each expired conversation
    for (const conversation of expiredConversations) {
      // Remove the conversation only from the receiver's previousMessages array
      await User.updateOne(
        { _id: conversation.receiverId },
        { $pull: { previousMessages: conversation._id } }
      );

      // We're no longer deleting messages or the conversation itself
    }

    console.log(`Updated ${expiredConversations.length} expired conversations (removed from receiver only)`);
  } catch (error) {
    console.error('Error in checkVents:', error);
  }
}

export default checkVents;