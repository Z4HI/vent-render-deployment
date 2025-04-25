import DailyMessage from '../models/dailyMessageSchema.js';
import User from '../models/userSchema.js';

const likeDailyAffirmation = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's message
        const dailyMessage = await DailyMessage.findOne({ date: today });
        if (!dailyMessage) {
            return res.status(404).json({ message: "No daily affirmation found for today" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user already liked today's affirmation
        if (user.likedDailyAffirmation) {
            return res.status(400).json({ 
                message: "You have already liked today's affirmation",
                likes: dailyMessage.affirmation.likes
            });
        }

        // Update user's like status and increment affirmation likes
        user.likedDailyAffirmation = true;
        dailyMessage.affirmation.likes += 1;
        
        await Promise.all([
            user.save(),
            dailyMessage.save()
        ]);

        res.status(200).json({
            message: "Affirmation liked successfully",
            likes: dailyMessage.affirmation.likes
        });
    } catch (error) {
        console.error('Error liking daily affirmation:', error);
        res.status(500).json({ 
            message: "Error liking daily affirmation",
            error: error.message 
        });
    }
};

export default likeDailyAffirmation; 