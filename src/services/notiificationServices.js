const prisma = require("../config/client.js");

export const getNotifications = async (userId) => {

  const notifications = await prisma.notification.findMany({
    where: {
      userId
    },
    include: {
      message: {
        select: {
          id: true,
          content: true,
          conversationId: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return notifications;
};

export const markNotificationRead = async (notificationId, userId) => {

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId
    }
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  const updatedNotification = await prisma.notification.update({
    where: {
      id: notificationId
    },
    data: {
      isRead: true
    }
  });

  return updatedNotification;
};