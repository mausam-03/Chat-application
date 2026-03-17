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
        });

        // 2. Emit message to room
        io.to(conversationId).emit("receive_message", message);

      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });
};