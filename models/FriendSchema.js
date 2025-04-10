import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "Friend" },
  senderUsername: { type: String, required: true },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Friend = mongoose.model("Friend", FriendSchema);

export default Friend;
