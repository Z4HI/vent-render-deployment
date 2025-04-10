
import User from "../models/userSchema.js";



const isNewUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(200).json({ isNewUser: true });
  } else {
    res.status(200).json({ isNewUser: false, user });
  }
};

export default isNewUser;