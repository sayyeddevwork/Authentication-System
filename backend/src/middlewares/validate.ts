// middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/AppError.js";
import { HttpStatusCode } from "../constants/httpStatusCodes.js";

type RequestPart = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, part: RequestPart = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(
        new AppError(
          "Validation failed",
          HttpStatusCode.UNPROCESSABLE_ENTITY,
          details,
        ),
      );
    }
    req[part] = result.data; // sanitized/typed data
    next();
  };
