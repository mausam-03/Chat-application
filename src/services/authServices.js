import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/client.js";
import { generateAccessToken } from "../utils/token.js";  

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

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = generateAccessToken({
    id: user.id
  });

  return token;
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