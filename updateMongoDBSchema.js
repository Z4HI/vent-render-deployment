import User from "./models/userSchema.js";
import { connectToDatabase } from "./db/mongodb.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const updateUserByUsername = async (username, updates) => {
  try {
    // Check if we're already connected
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }

    const result = await User.updateOne(
      { userName: username },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      console.log(`No user found with username: ${username}`);
    } else if (result.modifiedCount === 0) {
      console.log(`User found but no changes were made for username: ${username}`);
    } else {
      console.log(`Successfully updated user: ${username}`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export default updateUserByUsername;
// Example showing all possible properties that can be updated
const exampleUpdate = {
  // Basic user info
  displayName: "New Display Name",
  email: "newemail@example.com",
  categoryInterests: ["category1", "category2"],
  
  // Level and achievements
  level: 2,
  badge: "silver",
  totalVentCoinsSpent: 100,
  
  // Profile settings
  profileImage: "avatar1",
  profileImageCollection: ["avatar1", "avatar2"],
  age: "25",
  gender: "Male",
  
  // Vent-related settings
  ventLimit: 3,
  ventReceivedLimit: 5,
  isVentPlus: true,
  ventPlusExpiresAt: new Date("2024-12-31"),
  loginStreak: 7,
  helpedCount: 10,
  
  // Preferences
  darkMode: true,
  categories: ["category1", "category2"],
  
  // Notification settings
  expoPushToken: "new-token",
  notificationSettings: {
    ventReplied: true,
    ventReceived: true,
    ventExpiring: true
  },
  
  // Stats and tracking
  lastLogin: new Date(),
  ventsSentToday: 2,
  ventsReceivedToday: 3,
  flags: 0,
  VentCoins: 500
};

// Uncomment and modify the line below to update a specific user
// updateUserByUsername("targetUsername", exampleUpdate);
