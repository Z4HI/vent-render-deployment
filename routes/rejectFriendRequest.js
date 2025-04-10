import User from "../models/userSchema.js";
import FriendRequest from "../models/FriendRequestSchema.js";

const rejectFriendRequest = async (req, res) => {
  const { friendId, userId } = req.body;
  console.log("rejecting friend request", friendId);
  try {
    await FriendRequest.findByIdAndDelete(friendId);
    const user = await User.findById(userId);
    user.friendRequests = user.friendRequests.filter(request => request.toString() !== friendId);
    await user.save();
    return res.status(200).json({
      success: true
    }); 
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default rejectFriendRequest;