import User from "../models/userSchema.js";

const resetVentLimits = async (req, res) => {
  try {
    // Check if there are any users in the database
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('No users found in the database. Skipping vent limits reset.');
      return;
    }
    
    // Reset both ventsReceivedToday and ventsSentToday to 0 for all users
    await User.updateMany(
      {},
      { 
        $set: { 
          ventsReceivedToday: 0,
          ventsSentToday: 0
        } 
      }
    );

    // Get the io instance from the request object
    const io = req.app.get('io');
    
    // Emit a socket event to all connected clients
    if (io) {
      io.emit('ventLimitsReset', {
        timestamp: new Date(),
        message: "Vent limits have been reset"
      });
      console.log("Emitted ventLimitsReset event to all connected clients");
    } else {
      console.warn("Socket.io instance not available");
    }

    res.status(200).json({ 
      message: "Successfully reset vent limits for all users",
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error resetting vent limits:", error);
    res.status(500).json({ 
      message: "Error resetting vent limits", 
      error: error.message 
    });
  }
};

export default resetVentLimits; 