import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { sendError } from "../lib/response";
import { HTTP_STATUS } from "../lib/constants";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("[Error]", err.message);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      sendError(res, "A record with this value already exists.", HTTP_STATUS.CONFLICT);
      return;
    }
    if (err.code === "P2025") {
      sendError(res, "Record not found.", HTTP_STATUS.NOT_FOUND);
      return;
    }
  }

  sendError(
    res,
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    HTTP_STATUS.INTERNAL
  );
};