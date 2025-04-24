import DailyMessage from '../models/dailyMessageSchema.js';

const getDailyMessage = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyMessage = await DailyMessage.findOne({ date: today });

        if (!dailyMessage) {
            return res.status(404).json({ 
                message: "No daily message found for today" 
            });
        }

        res.status(200).json({
            quote: dailyMessage.quote,
            affirmation: dailyMessage.affirmation
        });
    } catch (error) {
        console.error('Error fetching daily message:', error);
        res.status(500).json({ 
            message: "Error fetching daily message",
            error: error.message 
        });
    }
};

export default getDailyMessage; 