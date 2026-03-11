import * as notificationService from "../services/notificationService.js";

export const getNotifications = async (req, res, next) => {
  try {

    const userId = req.user.id;

    const notifications = await notificationService.getNotifications(userId);

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    next(error);
  }
};


export const markNotificationRead = async (req, res, next) => {
  try {

    const notificationId = parseInt(req.params.id);
    const userId = req.user.id;

    const notification = await notificationService.markNotificationRead(
      notificationId,
      userId
    );

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {
    next(error);
  }
};