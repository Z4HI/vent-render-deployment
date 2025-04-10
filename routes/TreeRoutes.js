import Tree from "../models/TreeSchema.js";
import User from "../models/userSchema.js";
import express from "express";
import badge from "../helper/badgeSystem.js";
import mongoose from "mongoose";

const app = express.Router();

app.post("/updateTreeLevel", async (req, res) => {
    try {
        const { treeId, treeLevel, userId } = req.body;
        
        
        // Find and update the tree
        const tree = await Tree.findById(treeId);
        if (!tree) {
            return res.status(404).json({
                success: false,
                message: "Tree not found"
            });
        }
        tree.treeLevel = treeLevel;
        await tree.save();
        

        // Find and update the user's tokens
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        user.totalVentCoinsSpent += 50;
        const newBadge = badge(user.totalVentCoinsSpent);
 
        user.VentCoins -= 50; // Deduct 50 tokens for level up
        user.badge = newBadge;
        await user.save();
        

        return res.status(200).json({
          success: true,
          message: "Tree level and tokens updated successfully",
          treeLevel: tree.treeLevel,
          VentCoins: user.VentCoins,
          totalVentCoinsSpent: user.totalVentCoinsSpent,
          badge: user.badge
        });
    } catch (error) {
        console.error("Error updating tree level:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to update tree level"
        });
    }
});
app.put('/updateTree', async (req, res) => {
    try {
      const { treeId, updatedTree } = req.body;
      
      if (!treeId || !updatedTree) {
        return res.status(400).json({ error: 'Invalid tree data' });
      }
  
      const updatedTreeDoc = await Tree.findByIdAndUpdate(
        treeId,
        { $set: updatedTree },
        { new: true }
      );
  
      res.json(updatedTreeDoc);
    } catch (error) {
      console.error('Error updating tree:', error);
      res.status(500).json({ error: 'Failed to update tree' });
    }
  });

app.get("/getTrees", async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const trees = await Tree.find({ _id: { $in: user.Trees } });
        
        return res.status(200).json({
            success: true,
            message: "Trees retrieved successfully",
            Trees: trees
        });
    } catch (error) {
        console.error("Error getting trees:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get trees"
        });
    }
});

app.post("/getTreesByIds", async (req, res) => {
    const { treeIds } = req.body;
    
    if (!treeIds || !Array.isArray(treeIds) || treeIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid tree IDs provided"
        });
    }

    try {
        // Convert string IDs to ObjectIds
        const objectIds = treeIds.map(id => {
            try {
                return new mongoose.Types.ObjectId(id);
            } catch (error) {
                console.error(`Invalid ObjectId: ${id}`);
                return null;
            }
        }).filter(id => id !== null);

        if (objectIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid tree IDs provided"
            });
        }

        const trees = await Tree.find({ _id: { $in: objectIds } });
        
        if (trees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No trees found with the provided IDs"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Trees retrieved successfully",
            trees: trees
        });
    } catch (error) {
        console.error("Error getting trees by IDs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get trees by IDs"
        });
    }
});

export default app;


   