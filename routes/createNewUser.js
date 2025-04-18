import e from "express";
import User from "../models/userSchema.js";
import mongoose from "mongoose";
import Tree from "../models/TreeSchema.js"; 
import badge from "../helper/badgeSystem.js";

const createNewUser = async (req, res) => {
  console.log('Creating new user...');
  const { email, expoPushToken, username } = req.body; // Expecting expoPushToken in the request body
  console.log(email, expoPushToken, username);
  try {
   
    const usernameExists = await User.findOne({
      userName: { $regex: new RegExp(`^${username}$`, 'i') }
    });

    if (usernameExists) {
      res.status(400).json({ message: "Username already exists" });
      return;
    } 
    const newTree = new Tree({
      type: "oakTree",
      treeImage: "oakTree.png",
      guardian: "",
      treeLevel: 1,
      items: [],
      createdAt: new Date(),
      SkyArray: ["blue"],
      ActiveSky: "blue",
      IslandsArray: ["basicFloatingIsland"],
      ActiveIsland: "basicFloatingIsland",
      GuardianArray: [],
      ActiveGuardian: "",
      MusicArray: [],
      ActiveMusic: "",
    });
    const savedTree = await newTree.save();
    
    const totalVentCoins = 0;
    const newUser = new User({
      userName: username,
      email: email,
      expoPushToken: expoPushToken, // Store the token when creating the new user
      Trees: [savedTree._id],
      VentCoins: 100,
      isNewUser: false,
      profileImageCollection: ["blank.png", "female.jpg", ],
      profileImage: "blank.png",
      totalVentCoinsSpent: totalVentCoins,
      badge: badge(totalVentCoins),
      isVentPlus: false,
      ventLimit: 1,
      ventReceivedLimit: 1,
    });

    const savedUser = await newUser.save();
    const verifiedUser = await User.findById(savedUser._id).populate('Trees');
    console.log(verifiedUser);

    res.status(201).json({ newUser: verifiedUser });
  } catch (error) {
    console.error('Error in createNewUser:', error);
    res.status(500).json({ message: "Error creating user: " + error });
  }
};

export default createNewUser;
