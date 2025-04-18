import User from "../models/userSchema.js";
import Conversation from "../models/ConversationSchema.js";
import Message from "../models/messageSchema.js";

const createNewVent = async (req, res) => {
  try {
    const { title, message, senderId, senderName } = req.body;

    // Find the sender
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Check if sender has reached their vent limit
    const senderVentsToday = await Conversation.countDocuments({
      senderId: senderId,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    // Find eligible recipients (users who haven't hit their received vent limit)
    const eligibleRecipients = await User.find({
      _id: { $ne: senderId }, // Exclude the sender
      $expr: { $lt: ["$ventsReceivedToday", "$ventReceivedLimit"] } // Haven't hit their received limit
    });

    if (eligibleRecipients.length === 0) {
      return res.status(400).json({ 
        message: "No eligible recipients found at the moment. Try again later!" 
      });
    }

    // Randomly select a recipient
    const randomRecipient = eligibleRecipients[Math.floor(Math.random() * eligibleRecipients.length)];

    const now = new Date();
    //now.setMinutes(0,0,0);
    const createdAt = now
    const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000);
    const conversation = new Conversation({
      title,
      senderId,
      senderName,
      receiverId: randomRecipient._id,
      receiverName: randomRecipient.displayName,
      read: false,
      createdAt: createdAt,
      expiresAt: expiresAt,
      responded: false,
    });

    await conversation.save();

    // Create the initial message
    const initialMessage = new Message({
      senderId,
      senderName,
      message,
      conversationID: conversation._id,
      read: false,
      createdAt: new Date(),
      receiverId: randomRecipient._id,
      senderProfileImage: sender.profileImage,
    });

    await initialMessage.save();

    // Update the conversation with the message
    conversation.messages.push(initialMessage);
    conversation.lastMessage = initialMessage;
    await conversation.save();

    // Update sender's previous messages and sent count
    sender.previousMessages.push(conversation._id);
    sender.ventsSentToday += 1;
    await sender.save();

    // Update recipient's previous messages and received count
    randomRecipient.previousMessages.push(conversation._id);
    randomRecipient.ventsReceivedToday += 1;
    await randomRecipient.save();

    // Return the conversation with recipient info for notifications
    res.status(201).json({
      conversation,
      expoPushToken: randomRecipient.expoPushToken
    });

  } catch (error) {
    console.error("Error creating vent:", error);
    res.status(500).json({ message: "Error creating vent", error: error.message });
  }
};

export default createNewVent;