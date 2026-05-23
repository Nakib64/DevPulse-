import {
  Response,
  NextFunction,
} from "express";

import { StatusCodes } from "http-status-codes";

import { verifyToken } from "../utils/jwt";

import { AuthRequest } from "../types";

const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization;

    // no token
    if (!token) {
      return res
        .status(
          StatusCodes.UNAUTHORIZED
        )
        .json({
          success: false,
          message:
            "Unauthorized access",
        });
    }

    // verify token
    const decoded =
      verifyToken(token);

    // attach user
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(
        StatusCodes.UNAUTHORIZED
      )
      .json({
        success: false,
        message:
          "Invalid or expired token",
      });
  }
};

export default auth;