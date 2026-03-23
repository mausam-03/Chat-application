import prisma from "../config/client.js";

import { verifyAccessToken } from "../utils/token.js";

export const chatSocket = (io) => {
  // Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

 io.on("connection", async (socket) => {
    socket.userId = socket.user.id;
    console.log(`User connected: ${socket.id} (UserId: ${socket.userId})`);
    try {
  const conversations = await prisma.conversationParticipant.findMany({
    where: { userId: socket.userId },
  });

  conversations.forEach((c) => {
    socket.join(c.conversationId);
  });

  console.log(`User ${socket.userId} joined all conversations`);
  } catch (err) {
  console.error("Failed to join conversations:", err);
  }
    // Update online status
    try {
      await prisma.user.update({
        where: { id: socket.userId },
        data: { isOnline: true },
      });
      // Broadcast presence to all other connected clients
      socket.broadcast.emit("presence_update", { userId: socket.userId, isOnline: true });
    } catch (err) {
      console.error("Failed to update user presence on connection:", err);
    }

    // Join conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined ${conversationId}`);
    });

    // Send message
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, content } = data;
        const senderId = socket.userId;
        
         const isParticipant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: senderId,
        },
      },
    });
    
    if (!isParticipant) {
      return socket.emit("error", { message: "Unauthorized" });
    }

    for (const participant of participants) {
    if (participant.userId !== senderId) {
    const user = await prisma.user.findUnique({
      where: { id: participant.userId },
      select: { isOnline: true },
    });

    if (!user?.isOnline) {
      await prisma.notification.create({
        data: {
          userId: participant.userId,
          messageId: message.id,
        },
      });
    }
  }
 }

        // 1. Save message in DB
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId,
            content,
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });
        //update conversation's updatedAt so conversations are sorted by recent activity
        await prisma.userPresence.upsert({
        where: { userId: socket.userId },
        update: { status: "ONLINE" },
        create: { userId: socket.userId, status: "ONLINE" },
   });

        // 2. Emit message to room
        io.to(conversationId).emit("receive_message", message);

        // 4. Create message status for all participants
     const participants = await prisma.conversationParticipant.findMany({
     where: { conversationId },
   });

     const statusEntries = participants.map((p) => ({
     messageId: message.id,
     userId: p.userId,
     status: p.userId === senderId ? "SEEN" : "SENT",
   }));

  await prisma.messageStatus.createMany({
  data: statusEntries,
  });

      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
        console.error(error);
      }
    });

    // Mark message as delivered
    socket.on("message_delivered", async ({ messageId }) => {
    try {
    await prisma.messageStatus.updateMany({
      where: {
        messageId,
        userId: socket.userId,
      },
      data: { status: "DELIVERED" },
    });
  } catch (err) {
    console.error("Delivery update failed:", err);
  }
 });

// Mark message as seen
    socket.on("message_seen", async ({ messageId }) => {
    try {
    await prisma.messageStatus.updateMany({
      where: {
        messageId,
        userId: socket.userId,
      },
      data: { status: "SEEN" },
    });
  } catch (err) {
    console.error("Seen update failed:", err);
  }
});
  

    socket.on("typing", ({ conversationId }) => {
    socket.to(conversationId).emit("typing", {
    userId: socket.userId,
  });
});

  socket.on("stop_typing", ({ conversationId }) => {
  socket.to(conversationId).emit("stop_typing", {
    userId: socket.userId,
  });
 });
 });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      if(socket.userId) {
        await prisma.user.update({
            where: {id: socket.userId},
            data: { isOnline: false, lastSeen: new Date() },
        });
        socket.broadcast.emit("presence_update", { userId: socket.userId, isOnline: false });
      }
    });

}