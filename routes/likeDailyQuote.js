import DailyMessage from '../models/dailyMessageSchema.js';
import User from '../models/userSchema.js';

const likeDailyQuote = async (req, res) => {
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
            return res.status(404).json({ message: "No daily quote found for today" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user already liked today's quote
        if (user.likedDailyQuote) {
            return res.status(400).json({ 
                message: "You have already liked today's quote",
                likes: dailyMessage.quote.likes
            });
        }

        // Update user's like status and increment quote likes
        user.likedDailyQuote = true;
        dailyMessage.quote.likes += 1;
        
            user.save(),
            dailyMessage.save()
    

        res.status(200).json({
            message: "Quote liked successfully",
            likes: dailyMessage.quote.likes
        });
    } catch (error) {
        console.error('Error liking daily quote:', error);
        res.status(500).json({ 
            message: "Error liking daily quote",
            error: error.message 
        });
    }
};

export default likeDailyQuote; 