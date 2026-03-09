import prisma from "../config/client.js";

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const searchUsers = async (query) => {
  if (!query) return [];

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive"
      }
    },
    select: {
      id: true,
      username: true,
      avatarUrl: true
    },
    take: 20
  });

  return users;
};

export const updateProfile = async (userId, data) => {
  const { username, avatarUrl } = data;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      avatarUrl
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      createdAt: true
    }
  });

  return updatedUser;
};