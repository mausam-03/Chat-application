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
        const { conversationId, senderId, content } = data;

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
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // 2. Emit message to room
        io.to(conversationId).emit("receive_message", message);

      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
        console.error(error);
      }
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

  });
};