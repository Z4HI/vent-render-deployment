import User from "../models/userSchema.js";

const updateTokens = async (req, res) => {
  const { userId, tokens } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.tokens = tokens;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Tokens updated successfully",
      tokens: user.tokens
    });
  } catch (error) {
    console.error("Error updating tokens:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tokens"
    });
  }
};

export default updateTokens; 