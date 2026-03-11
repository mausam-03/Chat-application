const prisma = require("../config/client.js");

export const addParticipant = async (conversationId, userId) => {

  const participant = await prisma.conversationParticipant.create({
    data: {
      conversationId,
      userId
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      }
    }
  });

  return participant;
};
export const removeParticipant = async (conversationId, userId) => {

  await prisma.conversationParticipant.delete({
    where: {
      conversationId_userId: {
        conversationId,
        userId
      }
    }
  });

};

export const getParticipants = async (conversationId) => {

  const participants = await prisma.conversationParticipant.findMany({
    where: {
      conversationId
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      }
    }
  });

  return participants;
};

