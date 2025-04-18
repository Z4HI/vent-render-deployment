import User from "../models/userSchema.js";
import express from "express";

const router = express.Router();

router.put("/", async (req, res) => {
  const { userId, updateData } = req.body;
  
  if (!userId || !updateData) {
    console.log("Missing required fields:", { userId, updateData });
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true } // Ensure that the updated user is returned
    ).exec();
    
    if (!updatedUser) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user data" });
  }
});

export default router;
