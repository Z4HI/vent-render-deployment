import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
});

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;

