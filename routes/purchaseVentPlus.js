import User from '../models/userSchema.js';

const purchaseVentPlus = async (req, res) => {
  try {
    const { userId, months } = req.body;
    
    if (!userId || !months) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.isVentPlus) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already has VentPlus' 
      });
    }

    user.isVentPlus = true;
    user.ventLimit = 3;
    user.ventReceivedLimit = 5;
    user.ventLimitExpiration = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'VentPlus purchased successfully',
      user: {
        isVentPlus: user.isVentPlus,
        ventLimit: user.ventLimit,
        ventReceivedLimit: user.ventReceivedLimit,
        ventLimitExpiration: user.ventLimitExpiration
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export default purchaseVentPlus;
