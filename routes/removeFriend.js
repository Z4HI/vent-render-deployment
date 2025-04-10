import User from "../models/userSchema.js";
import Friend from "../models/FriendSchema.js";

export const removeFriend = async (req, res) => {
    const { friendId, userId, userName } = req.body;
    
    try{
        // Find the friend document
        const friendDoc = await Friend.findById(friendId);
        if (!friendDoc) {
            return res.status(404).json({ message: "Friend not found" });
        }

        // Find the friend's user document
        const friendUser = await User.findById(friendDoc.userRef);
        if (!friendUser) {
            return res.status(404).json({ message: "Friend user not found" });
        }

        // Find the friend's Friend document that references the current user
        const friendsDoc = await Friend.findOne({
            userName: friendUser.userName,
            userRef: userId
        });

        if (!friendsDoc) {
            return res.status(404).json({ message: "Friend's friend document not found" });
        }

        // Delete both friend documents
        await Friend.findByIdAndDelete(friendDoc._id);
        await Friend.findByIdAndDelete(friendsDoc._id);

        // Update both users' friend lists
        await User.findByIdAndUpdate(userId, { $pull: { friends: friendDoc._id } });
        await User.findByIdAndUpdate(friendUser._id, { $pull: { friends: friendsDoc._id } });

        res.status(200).json({
            message: "Friend removed successfully",
            friendFriendId: friendsDoc._id,
            receiver: friendUser._id
        });    
    } catch (error) {
        console.log("Error removing friend:", error);
        res.status(500).json({ message: "Error removing friend", error: error.message });
    }
};

export default removeFriend;
