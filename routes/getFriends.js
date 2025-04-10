import User from "../models/userSchema.js";
import Friend from "../models/FriendSchema.js";
import Tree from "../models/TreeSchema.js";

const getFriends = async (req, res) => {
  console.log("getFriends");
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find all friends where the senderUsername matches the current user's username
    const friends = await Friend.find({ senderUsername: user.userName })
      .populate('friendId');
    
    // Manually populate the Trees field for each friend
    for (let friend of friends) {
      if (friend.friendId && friend.friendId.Trees && friend.friendId.Trees.length > 0) {
        const treeIds = friend.friendId.Trees;
        const trees = await Tree.find({ _id: { $in: treeIds } });
        friend.friendId.Trees = trees;
      }
    }
    
    console.log("Friends with trees:", JSON.stringify(friends, null, 2));
    res.status(200).json(friends);

  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getFriends; 