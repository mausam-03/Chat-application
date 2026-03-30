const prisma = require("../config/client");
export const createConversation = async (userId, data) => {
  const { type, name, participantIds } = data;
  if (type === "PRIVATE") {

  const existing = await prisma.conversation.findFirst({
    where: {
      type: "PRIVATE",
      participants: {
        every: {
          userId: { in: [userId, ...participantIds] }
        }
      }
    }
  });

  if (existing) {
    return existing;
  }

}
  const conversation = await prisma.conversation.create({
    data: {
      type,
      name,
      participants: participantIds?.length
        ? {
            create: participantIds.map((id) => ({
              userId: id
            }))
          }
        : undefined
    }
  });

  return conversation;
};
 
//fetch logged in user conversations
export const getUserConversations = async (userId) => {

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: userId
        }
      }
    },
    include: {
      lastMessage: {
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return conversations;
};

///get single conversation and make sure user belongs to it
export const getConversationById = async (conversationId, userId) => {

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: {
          userId: userId
        }
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      }
    }
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return conversations.map((conv) => {
    const unreadCount = conv.messages.reduce(
      (acc, msg) => acc + msg.statuses.length,
      0
    );

    return {
      ...conv,
      unreadCount,
      messages: undefined, // cleanup
    };
  });
};

//in future make sure only admins and creators can delete conversations
export const deleteConversation = async (conversationId, userId) => {

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: {
          userId
        }
      }
    }
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await prisma.conversation.delete({
    where: { id: conversationId }
  });

};

