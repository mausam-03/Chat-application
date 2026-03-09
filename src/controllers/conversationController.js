import * as conversationService from "../services/conversationService.js";

export const createConversation = async (req, res, next) => {
  try {

    const userId = req.user.id;

    const conversation = await conversationService.createConversation(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: conversation
    });

  } catch (error) {
    next(error);
  }
};


export const getUserConversations = async (req, res, next) => {
  try {

    const userId = req.user.id;

    const conversations =
      await conversationService.getUserConversations(userId);

    res.json({
      success: true,
      data: conversations
    });

  } catch (error) {
    next(error);
  }
};


export const getConversationById = async (req, res, next) => {
  try {

    const conversationId = parseInt(req.params.id);
    const userId = req.user.id;

    const conversation =
      await conversationService.getConversationById(conversationId, userId);

    res.json({
      success: true,
      data: conversation
    });

  } catch (error) {
    next(error);
  }
};


export const deleteConversation = async (req, res, next) => {
  try {

    const conversationId = parseInt(req.params.id);
    const userId = req.user.id;

    await conversationService.deleteConversation(conversationId, userId);

    res.json({
      success: true,
      message: "Conversation deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};