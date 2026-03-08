import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async ({ name, email, password }) => {

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  return user;
};

export const login = async ({ email, password }) => {

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};

export const logout = async (userId) => {

  // If using JWT only, logout is handled client side
  // unless using token blacklist or refresh tokens

  return true;
};

export const getMe = async (userId) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  return user;
};