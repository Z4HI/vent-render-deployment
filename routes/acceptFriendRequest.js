import User from "../models/userSchema.js";
import FriendRequest from "../models/FriendRequestSchema.js";
import Friend from "../models/FriendSchema.js";
import mongoose from "mongoose";

const acceptFriendRequest = async (req, res) => {
  const { friendId, userId } = req.body;

  try {
    const friendRequest = await FriendRequest.findById(friendId);
    const friend = await User.findOne({ userName: friendRequest.userName });
    const user = await User.findById(userId);
    user.friendRequests = user.friendRequests.filter(request => request.toString() !== friendId);
    await user.save();

    // Create friend relationship for the accepter (user accepting the request)
    const AccepterFriend = new Friend({
      _id: new mongoose.Types.ObjectId(),
      senderUsername: user.userName,
      friendId: friend._id
    });

    // Create friend relationship for the receiver (user who sent the request)
    const receiverFriend = new Friend({ 
      _id: new mongoose.Types.ObjectId(),
      senderUsername: friend.userName,
      friendId: user._id
    });

    await AccepterFriend.save();
    await receiverFriend.save();
    
    // Delete the friend request
    await FriendRequest.findByIdAndDelete(friendId);

    // Update the accepter's friends array with the Friend document ID
    await User.findByIdAndUpdate(
      user._id, 
      { $push: { friends: AccepterFriend._id } },
      { new: true }
    );
    
    // Update the receiver's friends array with the Friend document ID
    await User.findByIdAndUpdate(
      friend._id,
      { $push: { friends: receiverFriend._id } },
      { new: true }
    );
    
    // Populate the userRef field before sending the response
    const populatedAccepterFriend = await Friend.findById(AccepterFriend._id).populate('friendId');
    const populatedReceiverFriend = await Friend.findById(receiverFriend._id).populate('friendId');
    
    res.status(200).json({ 
      message: "Friend request accepted successfully",
      AccepterFriend: populatedAccepterFriend,
      receiverFriend: populatedReceiverFriend,
      receiverId: friend._id
    });
  } catch (error) {
    console.log("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request", error: error.message });
  }
};

export default acceptFriendRequest; 