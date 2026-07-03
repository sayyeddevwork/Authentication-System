import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (retries = MAX_RETRIES): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error(err, `MongoDB connection failed. Retries left: ${retries}`);

    if (retries === 0) {
      logger.error("MongoDB connection failed after max retries. Exiting.");
      process.exit(1);
    }

    await delay(RETRY_DELAY_MS);
    return connectDB(retries - 1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
};

// Optional: surface ongoing connection health after initial connect
mongoose.connection.on("error", (err) => {
  logger.error(err, "MongoDB connection error");
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});
