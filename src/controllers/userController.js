import * as userService from "../services/userService.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userService.getUserById(userId);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await userService.getUserById(userId);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.query;

    const users = await userService.searchUsers(query);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updatedUser = await userService.updateProfile(userId, req.body);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};