import User from "../models/userSchema.js";
import Conversation from "../models/ConversationSchema.js";
import Message from "../models/messageSchema.js";

const createNewVent = async (req, res) => {
  try {
    const { title, message, senderId, senderName, age, gender, category } = req.body;
    console.log(age, gender, category);

    // Find the sender
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    let eligibleRecipients = []; // Declare eligibleRecipients at the start

    if(sender.isVentPlus){
      // Build the query for Vent+ users with filters
      const filterQuery = {
        _id: { $ne: senderId }, // Exclude the sender
        $expr: { $lt: ["$ventsReceivedToday", "$ventReceivedLimit"] } // Haven't hit their received limit
      };

      // Log initial query results
      const initialRecipients = await User.find(filterQuery);
      console.log(`Initial eligible recipients (before filters): ${initialRecipients.length}`);

      // Add age filter if provided and not "none"
      if (age && age !== "none") {
        const [minAge, maxAge] = age.split('-').map(Number);
        const ageFilterQuery = { ...filterQuery, age: { $gte: minAge, $lte: maxAge } };
        const ageFiltered = await User.find(ageFilterQuery);
        console.log(`Recipients after age filter (${age}): ${ageFiltered.length}`);
        
        // Only apply age filter if it returns results
        if (ageFiltered.length > 0) {
          filterQuery.age = { $gte: minAge, $lte: maxAge };
        } else {
          console.log("Age filter returned no results, skipping age filter");
        }
      }

      // Add gender filter if provided and not "none"
      if (gender && gender !== "none") {
        const genderFilterQuery = { 
          ...filterQuery, 
          $expr: { 
            $eq: [{ $toLower: "$gender" }, gender.toLowerCase()] 
          } 
        };
        const genderFiltered = await User.find(genderFilterQuery);
        console.log(`Recipients after gender filter (${gender}): ${genderFiltered.length}`);
        
        // Only apply gender filter if it returns results
        if (genderFiltered.length > 0) {
          filterQuery.$expr = { 
            $and: [
              filterQuery.$expr,
              { $eq: [{ $toLower: "$gender" }, gender.toLowerCase()] }
            ]
          };
        } else {
          console.log("Gender filter returned no results, skipping gender filter");
        }
      }

      // Add category filter if provided and not "none"
      if (category && category !== "none") {
        const categoryFilterQuery = { 
          ...filterQuery,
          $or: [
            { categoryInterests: { $in: [category] } },
            { categoryInterests: { $size: 0 } } // Also match users with no categories set
          ]
        };
        const categoryFiltered = await User.find(categoryFilterQuery);
        console.log(`Recipients after category filter (${category}): ${categoryFiltered.length}`);
        
        // Only apply category filter if it returns results
        if (categoryFiltered.length > 0) {
          filterQuery.$or = [
            { categoryInterests: { $in: [category] } },
            { categoryInterests: { $size: 0 } }
          ];
        } else {
          console.log("Category filter returned no results, skipping category filter");
        }
      }

      eligibleRecipients = await User.find(filterQuery);
      console.log("Final eligible recipients count:", eligibleRecipients.length);

      // If no recipients found with filters, fall back to basic eligibility
      if (eligibleRecipients.length === 0) {
        console.log("No recipients found with filters, falling back to basic eligibility");
        eligibleRecipients = await User.find({
          _id: { $ne: senderId },
          $expr: { $lt: ["$ventsReceivedToday", "$ventReceivedLimit"] }
        });
      }
    } else {
      eligibleRecipients = await User.find({
        _id: { $ne: senderId },
        $expr: { $lt: ["$ventsReceivedToday", "$ventReceivedLimit"] }
      });
    }

    if (eligibleRecipients.length === 0) {
      return res.status(400).json({ 
        message: "No eligible recipients found at the moment. Try again later!" 
      });
    }

    // Randomly select a recipient
    const randomRecipient = eligibleRecipients[Math.floor(Math.random() * eligibleRecipients.length)];

    const now = new Date();
    //now.setMinutes(0,0,0);
    const createdAt = now
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    const conversation = new Conversation({
      title,
      senderId,
      senderName,
      receiverId: randomRecipient._id,
      receiverName: randomRecipient.displayName,
      read: false,
      createdAt: createdAt,
      expiresAt: expiresAt,
      responded: false,
    });

    await conversation.save();

    // Create the initial message
    const initialMessage = new Message({
      senderId,
      senderName,
      message,
      conversationID: conversation._id,
      read: false,
      createdAt: new Date(),
      receiverId: randomRecipient._id,
      senderProfileImage: sender.profileImage,
    });

    await initialMessage.save();

    // Update the conversation with the message
    conversation.messages.push(initialMessage);
    conversation.lastMessage = initialMessage;
    await conversation.save();

    // Update sender's previous messages and sent count
    sender.previousMessages.push(conversation._id);
    sender.ventsSentToday += 1;
    await sender.save();

    // Update recipient's previous messages and received count
    randomRecipient.previousMessages.push(conversation._id);
    randomRecipient.ventsReceivedToday += 1;
    await randomRecipient.save();

    // Return the conversation with recipient info for notifications
    res.status(201).json({
      conversation,
      expoPushToken: randomRecipient.expoPushToken
    });

  } catch (error) {
    console.error("Error creating vent:", error);
    res.status(500).json({ message: "Error creating vent", error: error.message });
  }
};

export default createNewVent;