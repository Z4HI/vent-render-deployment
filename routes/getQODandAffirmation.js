import DailyMessage from "../models/dailyMessageSchema.js";

const getQODandAffirmation = async (req, res) => {
    const qod = await DailyMessage.findOne({ date: new Date().setHours(0, 0, 0, 0) });
    const affirmation = await DailyMessage.findOne({ date: new Date().setHours(0, 0, 0, 0) });
    res.json({ qod, affirmation });
}

export default getQODandAffirmation;