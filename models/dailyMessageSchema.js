import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DailyMessageSchema = new Schema({
    date: { 
        type: Date, 
        required: true,
        default: new Date().setHours(0, 0, 0, 0), // Set to start of current day
        
    },
    quote: {
        text: { type: String, required: true },
        author: { type: String },
        likes: { type: Number, default: 0 },
        liked: { type: Boolean, default: false }
    },
    affirmation: { 
        text: { type: String, required: true },
        likes: { type: Number, default: 0 },
        liked: { type: Boolean, default: false }
    }
});

// Create a compound index on date to ensure only one entry per day
DailyMessageSchema.index({ date: 1 }, { unique: true });

const DailyMessage = mongoose.model("DailyMessage", DailyMessageSchema);

export default DailyMessage; 