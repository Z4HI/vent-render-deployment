// Store user socket connections
const userSockets = {};

// Function to initialize socket handlers
export const initializeSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");
    const { userId } = socket.handshake.query;
    
    if (userId) {
      userSockets[userId] = socket.id;
    }

    // Handle vent sending
    socket.on("sendVent", (ventData) => {
      const recipientSocketId = userSockets[ventData.receiverId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveVent", ventData);
      }
    });

    // Handle thank you events
    socket.on("thankYouSent", (data) => {
      const recipientSocketId = userSockets[data.receiverId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveThankYou", data.conversationId);
      }
    });

    // Handle vent deletion
    socket.on("deleteVent", (ventData) => {
      const recipientSocketId = userSockets[ventData.receiverId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("updateDeletedVent", ventData);
      } else {
        console.log(`User ${ventData.receiverId} is not online`);
      }
    });

    // Handle conversation joining
    socket.on("joinConversation", (conversationID) => {
      socket.join(conversationID);
    });

    // Handle message sending
    socket.on("sendMessage", (messageData) => {
      io.to(messageData.conversationID).emit("receiveMessage", messageData);
    });

    // Handle friend request sending
    socket.on("addFriend", (data) => {
      const recipientSocketId = userSockets[data.receiverId];
      
     
      if (recipientSocketId) {
        
        io.to(recipientSocketId).emit("receiveFriendRequest", {
          newFriendRequest: data.newFriendRequest,
          conversations: data.conversations
        });
      }
    });

    // Handle friend request acceptance
    socket.on("acceptFriendRequest", (data) => {
      const recipientSocketId = userSockets[data.receiverId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("friendRequestAccepted", {
          newFriend: data.newFriend,
          receiverId: data.receiverId,
          conversations: data.conversations
        });
      }
    });

    // Handle friend removal
    socket.on("removeFriend", (data) => {
      const recipientSocketId = userSockets[data.receiver];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("friendRemoved", {
          friendId: data.friendId,
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
      delete userSockets[userId];
    });
  });

  console.log('Socket handlers initialized');
}; 