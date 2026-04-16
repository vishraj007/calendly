export const DEFAULT_USER_ID =
  process.env.DEFAULT_USER_ID || "default-user-cuid";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL: 500,
} as const;

// 👇 Add this line (important)
export type HttpStatusCode =
  (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];