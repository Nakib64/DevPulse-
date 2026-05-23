// Role-based access control middleware
import {
  Response,
  NextFunction,
} from "express";

import { StatusCodes } from "http-status-codes";

import { AuthRequest } from "../types";

const authorizeRole =
  (...roles: string[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    // no user
    if (!req.user) {
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

    // role check
    if (
      !roles.includes(
        req.user.role
      )
    ) {
      return res
        .status(
          StatusCodes.FORBIDDEN
        )
        .json({
          success: false,
          message: "Forbidden",
        });
    }

    next();
  };

export default authorizeRole;