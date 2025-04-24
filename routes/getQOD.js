import axios from 'axios';
import DailyMessage from '../models/dailyMessageSchema.js';

const getQOD = async () => {
    try {
        const affirmation = await axios.get('https://www.affirmations.dev/')
        const qod = await axios.get('https://zenquotes.io/api/today')
        
        // Create a new daily message entry
        const dailyMessage = new DailyMessage({
            date: new Date().setHours(0, 0, 0, 0),
            quote: {
                text: qod.data[0].q,
                author: qod.data[0].a
            },
            affirmation: {
                text: affirmation.data.affirmation
            }
        });

        // Save to database
        await dailyMessage.save();
        
        return {
            affirmation: affirmation.data,
            qod: qod.data
        }

    } catch (error) {
        console.error('Error fetching daily affirmation:', error);
        throw error;
    }
}

export default getQOD;