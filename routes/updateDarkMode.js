// Update theme preference

import User from '../models/userSchema.js';
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, isDarkMode } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { darkMode: isDarkMode },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Theme updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ message: 'Error updating theme', error: error.message });
  }
}); 

export default router;