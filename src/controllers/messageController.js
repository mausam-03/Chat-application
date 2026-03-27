import * as messageService from "../services/messageService.js";

export const createMessage = async (req, res, next) => {
  try {

    const senderId = req.user.id;

    const message = await messageService.createMessage(
      senderId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {
    next(error);
  }
};


export const getConversationMessages = async (req, res, next) => {
  try {

    const conversationId = parseInt(req.params.id);

    const messages = await messageService.getConversationMessages(
      conversationId
    );

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    next(error);
  }
};


export const getMessageById = async (req, res, next) => {
  try {

    const messageId = parseInt(req.params.id);

    const message = await messageService.getMessageById(messageId);

    res.json({
      success: true,
      data: message
    });

  } catch (error) {
    next(error);
  }
};


export const deleteMessage = async (req, res, next) => {
  try {

    const messageId = parseInt(req.params.id);
    const userId = req.user.id;

    await messageService.deleteMessage(messageId, userId);

    res.json({
      success: true,
      message: "Message deleted"
    });

  } catch (error) {
    next(error);
  }
};

export const sendAttachment = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const senderId = req.user.id;

    const file = req.file;

    // create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        messageType: "FILE",
      },
    });

    // save attachment
    const attachment = await prisma.attachment.create({
      data: {
        messageId: message.id,
        uploaderId: senderId,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
      },
    });

    res.json({ message, attachment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};