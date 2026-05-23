// Error handling middleware
import {
  Request,
  Response,
  NextFunction,
} from "express";

import { StatusCodes } from "http-status-codes";

import AppError from "../utils/AppError";

import { IErrorResponse } from "../types";

const globalErrorHandler = (
  error: Error | IErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode =
    StatusCodes.INTERNAL_SERVER_ERROR;

  let message =
    "Something went wrong";

  let errorDetails: string | Record<string, unknown> = "";

  // custom app error
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // postgres duplicate error
  else if (
    "code" in error &&
    error.code === "23505"
  ) {
    statusCode =
      StatusCodes.BAD_REQUEST;

    message =
      "Duplicate value error";

    errorDetails = {
      code: error.code,
      detail: "code" in error && "detail" in error ? (error.detail as string) : undefined,
    };
  }

  // generic error
  else if (error instanceof Error) {
    message = error.message;
    errorDetails = error.stack || error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetails && { errors: errorDetails }),
  });
};

export default globalErrorHandler;