import * as participantService from "../services/conversationParticipantService.js";

export const addParticipant = async (req, res, next) => {
  try {

    const conversationId = parseInt(req.params.id);
    const { userId } = req.body;

    const participant = await participantService.addParticipant(
      conversationId,
      userId
    );

    res.status(201).json({
      success: true,
      data: participant
    });

  } catch (error) {
    next(error);
  }
};


export const removeParticipant = async (req, res, next) => {
  try {

    const conversationId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    await participantService.removeParticipant(conversationId, userId);

    res.json({
      success: true,
      message: "Participant removed"
    });

  } catch (error) {
    next(error);
  }
};


export const getParticipants = async (req, res, next) => {
  try {

    const conversationId = parseInt(req.params.id);

    const participants = await participantService.getParticipants(conversationId);

    res.json({
      success: true,
      data: participants
    });

  } catch (error) {
    next(error);
  }
};