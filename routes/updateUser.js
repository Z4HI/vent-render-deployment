import User from "../models/userSchema.js";

const updateUser = async (req, res) => {
  const { userId, updateData } = req.body;
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true } // Ensure that the updated user is returned
    ).exec();
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user data" });
  }
};

export default updateUser;
