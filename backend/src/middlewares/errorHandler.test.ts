import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express, { Request, Response } from "express";
import { errorHandler } from "./errorHandler.js";
import { AppError } from "../utils/AppError.js";

describe("errorHandler middleware", () => {
  const app = express();

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  app.get("/throw-app-error", (req: Request, res: Response) => {
    throw new AppError("Custom not found", 404);
  });

  // Route that throws a generic/unexpected error
  app.get("/throw-generic-error", (req: Request, res: Response) => {
    throw new Error("Something broke");
  });

  app.use(errorHandler);

  it("should return the correct status and message for an AppError", async () => {
    const response = await request(app).get("/throw-app-error");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      message: "Custom not found",
    });
  });

  it("should default to 500 for a generic Error", async () => {
    const response = await request(app).get("/throw-generic-error");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: "error",
      message: "Something broke",
    });
  });
});
