import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./db/mongodb.js";
import createNewUser from "./routes/createNewUser.js";
import updateUser from "./routes/updateUser.js";
import createNewVent from "./routes/createNewVent.js";
import getConversations from "./routes/getConversations.js";
import getMessages from "./routes/getMessages.js";
import sendNewMessage from "./routes/sendNewMessage.js";
import deleteMessage from "./routes/deleteVent.js";
import updateTokens from "./routes/updateTokens.js";
import treeRoutes from "./routes/TreeRoutes.js";
import { Server } from "socket.io";
import http from "http";
import sendPushNotifications from "./routes/sendPushNotification.js";
import updateThankYouStatus from "./routes/updateThankYouStatus.js";
import isNewUser from "./routes/isNewUser.js";
import updateDarkMode from "./routes/updateDarkMode.js";
import { initializeCronJobs } from "./cron/schedules.js";
import { initializeSocketHandlers } from "./socket/socketHandlers.js";
import resetVentLimits from "./routes/resetVentLimits.js";
import rejectFriendRequest from "./routes/rejectFriendRequest.js";
import sendFriendRequest from "./routes/sendFriendRequest.js";
import acceptFriendRequest from "./routes/acceptFriendRequest.js";
import removeFriend from "./routes/removeFriend.js";
import searchUsers from "./routes/searchUsers.js";
import { HourlyVentCheckCronJob } from "./cron/schedules.js";
import purchaseItems from "./routes/purchaseItem.js";
import getConversationsByUsers from "./routes/getConversationsByUsers.js";
import checkVent from "./routes/checkVentsCronJob.js";
import getFriends from "./routes/getFriends.js";

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
dotenv.config();
const io = new Server(server, {
  cors: {
    origin:[process.env.EXPO_PUBLIC_IP, 'https://vent-1ed4d.firebaseapp.com'], // Replace with your React Native development server URL
    methods: ["GET", "POST"],
  },
});

// Make io instance available to routes
app.set('io', io);
connectToDatabase();
initializeCronJobs();
HourlyVentCheckCronJob();
initializeSocketHandlers(io);

app.use("/createNewUser", createNewUser);
app.use("/updateUser", updateUser);
app.use("/createVent", createNewVent);
app.use("/getConversations/:userId", getConversations);
app.use("/getMessages", getMessages);
app.use("/sendMessage", sendNewMessage);
app.use("/deleteVent", deleteMessage);
app.use("/updateTokens", updateTokens);
app.use("/trees", treeRoutes);
app.use("/sendNotifications", sendPushNotifications);
app.use("/updateThankYouStatus", updateThankYouStatus);
app.use("/isNewUser", isNewUser);
app.use("/updateDarkMode", updateDarkMode);
app.use("/resetVentLimits", resetVentLimits);
app.use("/checkVents", checkVent);
app.use("/sendFriendRequest", sendFriendRequest);
app.use("/rejectFriendRequest", rejectFriendRequest);
app.use("/acceptFriendRequest", acceptFriendRequest);
app.use("/removeFriend", removeFriend);
app.use("/searchUsers/:username", searchUsers);
app.use("/purchaseItem", purchaseItems);
app.use("/getConversationsByUsers", getConversationsByUsers);
app.use("/friends/:userId", getFriends);


server.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
