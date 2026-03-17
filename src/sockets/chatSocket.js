import prisma from "../config/client.js";

export const chatSocket = (io) => {
  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

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