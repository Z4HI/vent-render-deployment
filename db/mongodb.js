import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_API).then(() => {
    console.log("connected to mongodb");
  });
};
const DisconnectToDatabase = async () => {
  await mongoose.disconnect(process.env.MONGODB_API);
};

export { connectToDatabase, DisconnectToDatabase };
