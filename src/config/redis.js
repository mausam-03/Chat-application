import { createClient } from "redis";

export const pubClient = createClient({
  url: "redis://localhost:6379",
});

export const subClient = pubClient.duplicate();

export const connectRedis = async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
};