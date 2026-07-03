import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { HttpStatusCode } from "../constants/httpStatusCodes.js";
const router = express.Router();

router.get("/health/live", (req, res) =>
  res.status(HttpStatusCode.OK).json({ status: "OK" }),
);
router.get("/health/ready", async (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res
    .status(dbReady ? HttpStatusCode.OK : HttpStatusCode.SERVICE_UNAVAILABLE)
    .json({ status: dbReady ? "OK" : "unavailable" });
});

export default router;
