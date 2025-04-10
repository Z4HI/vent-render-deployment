import User from "../models/userSchema.js";
import FriendRequest from "../models/FriendRequestSchema.js";

const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // First populate the previousMessages with messages
    const user = await User.findById(userId).populate([
      {
        path: "previousMessages",
        populate: {
          path: "messages",
          model: "Message",
          options: {
            sort: { createdAt: -1 },
            limit: 1,
          },
        }
      },
    ]);
    // Then populate the Trees field separately
    await user.populate({
      path: "Trees",
      model: "Tree",
      options: {
        sort: { createdAt: -1 },
      }
    });

    await user.populate({
      path: "friendRequests",
      model: "FriendRequest",
      options: {
        sort: { createdAt: -1 },
      }
    });

    await user.populate({
      path: "friends",
      model: "Friend",
      options: {
        sort: { createdAt: -1 },
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const conversations = user.previousMessages || [];
    const trees = user.Trees || [];
    const friends = user.friends || [];
    const friendRequests = user.friendRequests || [];

    // Filter sent conversations
    const sent = conversations.filter((conversation) => {
      if (!conversation || !conversation.senderId) {
        return false;
      }
      return conversation.senderId.equals(user._id);
    });

    // Filter received conversations
    const received = conversations.filter((conversation) => {
      if (!conversation || !conversation.receiverId) {
        return false;
      }
      return conversation.receiverId.equals(user._id);
    });

    const unreadConversations = () => {
      if (received.length === 0) return 0;
      let c = 0;
      for (let i = 0; i < received.length; i++) {
        const conversation = received[i];
        if (!conversation) continue;
        
        const messages = conversation.messages || [];
        const lastMessage = messages[0]; // Since we limited to 1 message in populate
        if (
          lastMessage &&
          conversation.read === false &&
          lastMessage.senderId !== user._id
        ) {
          c++;
        }
        received[i].lastMessage = lastMessage;
      }
      return c;
    };

    const unreadVents = () => {
      if (sent.length === 0) return 0;
      let c = 0;
      for (let i = 0; i < sent.length; i++) {
        const conversation = sent[i];
        if (!conversation) continue;
        
        const messages = conversation.messages || [];
        const lastMessage = messages[0]; // Since we limited to 1 message in populate
        if (
          lastMessage &&
          conversation.read === false &&
          lastMessage.senderId !== user._id
        ) {
          c++;
        }
        sent[i].lastMessage = lastMessage;
      }
      return c;
    };

    const unreadCount = unreadConversations();
    const unreadVentsCount = unreadVents();
    // Send the filtered conversations as a response
    res.json({
      success: true,
      sentConversations: sent,
      receivedConversations: received,
      unreadConversations: unreadCount,
      unreadVents: unreadVentsCount,
      trees: trees,
      friends: friends,
      friendRequests: friendRequests
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

export default getConversations;
