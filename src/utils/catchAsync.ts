import {
  Response,
  NextFunction,
} from "express";

import { AuthRequest } from "../types";

const catchAsync =
  (
    fn: (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(
      fn(req, res, next)
    ).catch(next);
  };

export default catchAsync;