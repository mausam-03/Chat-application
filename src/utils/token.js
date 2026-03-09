import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = "1d";

/* ------------------ CREATE ACCESS TOKEN ------------------ */

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
};


/* ------------------ VERIFY TOKEN ------------------ */

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};


/* ------------------ DECODE TOKEN (OPTIONAL) ------------------ */

export const decodeToken = (token) => {
  return jwt.decode(token);
};