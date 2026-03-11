const prisma = require("../config/client.js");

export const createMessage = async (senderId, data) => {

  const { conversationId, content, messageType } = data;

  const message = await prisma.message.create({
    data: {
      conversationId: parseInt(conversationId),
      senderId,
      content,
      messageType
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      }
    }
  });

  return message;
};


export const getConversationMessages = async (conversationId) => {

  const messages = await prisma.message.findMany({
    where: {
      conversationId
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return messages;
};


export const getMessageById = async (messageId) => {

  const message = await prisma.message.findUnique({
    where: {
      id: messageId
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  if (!message) {
    throw new Error("Message not found");
  }

  return message;
};


export const deleteMessage = async (messageId, userId) => {

  const message = await prisma.message.findUnique({
    where: { id: messageId }
  });

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId !== userId) {
    throw new Error("Not authorized to delete this message");
  }

  await prisma.message.delete({
    where: {
      id: messageId
    }
  });

};