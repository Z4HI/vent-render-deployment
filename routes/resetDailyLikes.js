import User from '../models/userSchema.js';

const resetDailyLikes = async () => {
    try {
        // Update all users to reset their like status
        await User.updateMany(
            {}, // Match all users
            { 
                $set: { 
                    likedDailyAffirmation: false,
                    likedDailyQuote: false 
                } 
            }
        );
        console.log('Daily likes reset successfully');
    } catch (error) {
        console.error('Error resetting daily likes:', error);
        throw error;
    }
};

export default resetDailyLikes; 