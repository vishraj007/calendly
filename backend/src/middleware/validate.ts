import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../lib/response";
import { HTTP_STATUS } from "../lib/constants";

// Generic validator middleware
export const validate = <
  TBody = any,
  TParams = any,
  TQuery = any
>(
  schema: ZodSchema,
  target: "body" | "params" | "query" = "body"
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate =
      target === "body"
        ? req.body
        : target === "params"
        ? req.params
        : req.query;

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return sendError(
        res,
        "Validation failed",
        HTTP_STATUS.BAD_REQUEST,
        errors
      );
    }

    // ✅ Assign validated data safely
    if (target === "body") {
      req.body = result.data as TBody;
    } else if (target === "params") {
      (req as Request<any, any, any, any>).params = result.data as TParams;
    }
    // ⚠️ Do NOT assign req.query (read-only in Express)

    next();
  };
};