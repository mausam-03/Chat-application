import * as authService from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}; 