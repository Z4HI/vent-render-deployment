import User from "../models/userSchema.js";

const resetVentLimits = async (req, res) => {
  try {
    // Check if there are any users in the database
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('No users found in the database. Skipping vent limits reset.');
      if (res) {
        return res.status(200).json({ message: "No users found in database" });
      }
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

    // Get the io instance from the request object if available
    const io = req?.app?.get('io');
    
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

    if (res) {
      res.status(200).json({ 
        message: "Successfully reset vent limits for all users",
        timestamp: new Date()
      });
    } else {
      console.log("Successfully reset vent limits for all users");
    }
  } catch (error) {
    console.error("Error resetting vent limits:", error);
    if (res) {
      res.status(500).json({ 
        message: "Error resetting vent limits", 
        error: error.message 
      });
    } else {
      console.error("Error in cron job resetting vent limits:", error);
    }
  }
};

export default resetVentLimits; 