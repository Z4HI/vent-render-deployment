import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_API);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Connected to MongoDB");
    console.log("Database name:", mongoose.connection.db.databaseName);
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

const DisconnectToDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
};

export { connectToDatabase, DisconnectToDatabase };
