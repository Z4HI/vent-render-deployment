
import User from "../models/userSchema.js";

const searchUsers = async (req, res) => {
    console.log("Searching for users");
    const { username } = req.params;
    const users = await User.find({ userName: { $regex: username, $options: "i" } });
    res.json(users);
};

export default searchUsers;