import express from "express";
import { Expo } from "expo-server-sdk";

const app = express();
app.use(express.json());

const expo = new Expo();

// Endpoint to send push notifications
const sendPushNotifications = async (req, res) => {
  
  const { expoPushToken, title } = req.body;

  if (!Expo.isExpoPushToken(expoPushToken)) {
    return res.status(400).json({ error: "Invalid Expo Push Token" });
  }

  const messages = [
    {
      to: expoPushToken,
      sound: "default",
      title: "New Vent!",
      body: title,
      data: { screen: "Inbox" },
    },
  ];

  try {
    const ticket = await expo.sendPushNotificationsAsync(messages);
    res.json({ success: true, ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

export default sendPushNotifications;
