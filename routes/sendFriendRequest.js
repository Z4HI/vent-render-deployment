import User from "../models/userSchema.js";
import FriendRequest from "../models/FriendRequestSchema.js";
import Friend from "../models/FriendSchema.js";
import Conversation from "../models/ConversationSchema.js";
const sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  
  try {

    console.log("creating friend request");
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }
    if (sender.friendRequests.includes(receiver._id)) {
      return res.status(400).json({ error: "User has already sent a friend request" });
    }
    if (receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ error: "User has already sent a friend request" });
    }
    if (sender.userName === receiver.userName) {
      return res.status(400).json({ error: "You cannot send a friend request to yourself" });
    }

    const conversations = await Conversation.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: -1 });

    if (conversations.length > 0) {
    for (const conversation of conversations) {
      conversation.friendRequestSent = true;
      await conversation.save();
      }
    }

    // Check if the friend already exists in the user's friends array
    const existingFriend = await Friend.findOne({
      userName: sender.userName,
      friendUserName: receiver.userName
    });

    if (existingFriend) {
      return res.status(400).json({ error: "You are already friends with this user" });
    }

    const newFriendRequest = new FriendRequest({
        _id: sender._id,
        displayName: sender.displayName,
        userName: sender.userName,
        level: sender.level,
        profileImage: sender.profileImage,
    });
    await newFriendRequest.save();
    receiver.friendRequests.push(newFriendRequest._id);
    await receiver.save();
    console.log("friend request created");
    return res.status(200).json({
      success: true,
      newFriendRequest,
      receiverId: receiver._id,
      conversations
    });
  
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default sendFriendRequest;

