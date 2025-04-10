import User from "./models/userSchema.js";
import { connectToDatabase, DisconnectToDatabase } from "./db/mongodb.js";
import dotenv from "dotenv";
dotenv.config();

const updateMongoDBSchema = async () => {
  try {
    await connectToDatabase();

    await User.updateMany({}, { $unset: { FCMToken: "" } });

    console.log("Schema updated successfully!");
  } catch (error) {
    console.log(error);
  } finally {
    await DisconnectToDatabase();
  }
};

updateMongoDBSchema();
