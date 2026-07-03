// server.ts
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDB, disconnectDB } from "./config/db.js";

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
  });
};

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async (err) => {
    if (err) {
      logger.error(err, "Error while closing HTTP server");
      process.exit(1);
    }
    logger.info("HTTP server closed. No longer accepting connections.");

    try {
      await disconnectDB();
      process.exit(0);
    } catch (closeErr) {
      logger.error(closeErr, "Error while closing MongoDB connection");
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("Forcefully shutting down after timeout.");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error(reason, "Unhandled Promise Rejection");
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  logger.error(err, "Uncaught Exception");
  shutdown("uncaughtException");
});

startServer();
