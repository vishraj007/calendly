import { Response } from "express";
import { HTTP_STATUS } from "./constants";

// Success response
export const sendSuccess = <T>(
  res: Response,
  data: T,
  status: number = HTTP_STATUS.OK
) => {
  return res.status(status).json({
    success: true,
    data,
  });
};

// Error response (FIXED)
export const sendError = (
  res: Response,
  message: string,
  status: number = HTTP_STATUS.INTERNAL,
  details?: unknown
) => {
  return res.status(status).json({
    success: false,
    error: message,
    details,
  });
};

// 404 helper
export const sendNotFound = (
  res: Response,
  resource = "Resource"
) => {
  return sendError(
    res,
    `${resource} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};

// 409 helper
export const sendConflict = (
  res: Response,
  message: string
) => {
  return sendError(
    res,
    message,
    HTTP_STATUS.CONFLICT
  );
};