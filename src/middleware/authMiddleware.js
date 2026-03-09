import { verifyAccessToken } from "../utils/token.js";

export const authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({ message: "Invalid or expired token" });

  }
};