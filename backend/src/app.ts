import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import routers from "./routes/index.js";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { Messages } from "./constants/messages.js";
import { HttpStatusCode } from "./constants/httpStatusCodes.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(pinoHttp({ logger }));
app.use(express.json({ limit: "10kb" }));
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);
app.get("/", (req: Request, res: Response) => {
  res
    .status(HttpStatusCode.OK)
    .json({ status: "OK", message: "Welcome to Authentication System API" });
});

app.use("/api", routers);
app.use((req: Request, res: Response) => {
  res
    .status(HttpStatusCode.NOT_FOUND)
    .json({ status: "error", message: Messages.ROUTE_NOT_FOUND });
});
app.use(errorHandler);

export default app;
