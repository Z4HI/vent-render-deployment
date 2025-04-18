import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  isNewUser: { type: Boolean, default: true }, // Checks if the user is new
  isNewUser2: { type: Boolean, default: true }, // Checks if the user is new
  isNewUser3: { type: Boolean, default: true }, // Checks if the user is new
  userName: { type: String, required: true},
  displayName: { type: String, required: true, default: "Anonymous" },
  email: { type: String, required: true, unique: true },
  categoryInterests: { type: [String], default: [] },
  level: { type: Number, default: 1 },
  badge: { type: String, default: "bronze" },
  totalVentCoinsSpent: { type: Number, default: 0 },
  profileImage: {
    type: String, // Stores the avatar name (e.g., "avatar1", "avatar2")
    default: "blank.png",
  },
  profileImageCollection: [
    "female.jpg",
    "blank.png",
  ],
  age: { type: String, default: "Prefer not to say" },
  gender: {
    type: String,
    enum: ["Male", "Female", "Non-binary", "Transgender", "Other", "Prefer not to say"],
    default: "Prefer not to say",
  },
  previousMessages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  ], // Storing previous messages
  friends: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ], // Array of friend user IDs
  friendRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ], // Array of friend request user IDs
  VentCoins: { type: Number, default: 250 }, // Vent coins for leveling up
  Trees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tree" }], // User's current tree level

  // Vent-related settings
  ventLimit: { type: Number, default: 1 }, // Number of vents user can send per day
  ventReceivedLimit: { type: Number, default: 3 }, // Number of vents user can receive per day
  isVentPlus: { type: Boolean, default: false }, // If user has Vent+
  ventPlusExpiresAt: { type: Date }, // Tracks when Vent+ subscription expires
  loginStreak: { type: Number, default: 0 }, // Tracks the user's login streak
  helpedCount: { type: Number, default: 0 }, // Tracks how many people the user has helped
  darkMode: { type: Boolean, default: false }, // Tracks if the user has dark mode enabled
  categories: { type: [String], default: [] }, // Tracks the user's categories
  // Notification Settings
  expoPushToken: { type: String }, // Stores the user's FCM token
  notificationSettings: {
    ventReplied: { type: Boolean, default: true }, // Alert when a vent is replied to
    ventReceived: { type: Boolean, default: true }, // Notification when a vent enters inbox
    ventExpiring: { type: Boolean, default: true }, // Warning when a vent is about to expire
  },

  lastLogin: { type: Date }, // Tracks the last login time
  ventsSentToday: { type: Number, default: 0 }, // Tracks how many vents the user has sent today
  ventsReceivedToday: { type: Number, default: 0 }, // Tracks how many vents the user has received today
  flags: { type: Number, default: 0 }, // Tracks how many times the user has been flagged
  createdAt: { type: Date, default: Date.now },

});

const User = mongoose.model("User", UserSchema);
export default User;
