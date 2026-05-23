import { Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";

import {
  validateCreateIssue,
  validateUpdateIssue,
} from "./issues.validation";

import * as IssueService from "./issues.service";

import { AuthRequest } from "../../types";

export const createIssue =
  catchAsync(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {
      const validationError =
        validateCreateIssue(
          req.body
        );

      if (validationError) {
        res
          .status(
            StatusCodes.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              validationError,
          });
        return;
      }

      const payload = {
        ...req.body,
        reporter_id:
          req.user?.id,
      };

      const result =
        await IssueService.createIssue(
          payload
        );

      sendResponse(res, {
        success: true,
        statusCode:
          StatusCodes.CREATED,
        message:
          "Issue created successfully",
        data: result,
      });
    }
  );

export const getAllIssues =
  catchAsync(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {
      const {
        sort = "newest",
        type,
        status,
      } = req.query;

      const result =
        await IssueService.getAllIssues(
          sort as string,
          type as string,
          status as string
        );

      sendResponse(res, {
        success: true,
        statusCode:
          StatusCodes.OK,
        message:
          "Issues retrieved successfully",
        data: result,
      });
    }
  );

export const getSingleIssue =
  catchAsync(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {
      const result =
        await IssueService.getSingleIssue(
          Number(req.params.id)
        );

      sendResponse(res, {
        success: true,
        statusCode:
          StatusCodes.OK,
        message:
          "Issue retrieved successfully",
        data: result,
      });
    }
  );

export const updateIssue =
  catchAsync(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {
      const validationError =
        validateUpdateIssue(
          req.body
        );

      if (validationError) {
        res
          .status(
            StatusCodes.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              validationError,
          });
        return;
      }

      const result =
        await IssueService.updateIssue(
          Number(req.params.id),
          req.body,
          {
            id: req.user?.id ?? 0,
            role: req.user?.role ?? "contributor",
          }
        );

      sendResponse(res, {
        success: true,
        statusCode:
          StatusCodes.OK,
        message:
          "Issue updated successfully",
        data: result,
      });
    }
  );

export const deleteIssue =
  catchAsync(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {
      await IssueService.deleteIssue(
        Number(req.params.id)
      );

      sendResponse(res, {
        success: true,
        statusCode:
          StatusCodes.OK,
        message:
          "Issue deleted successfully",
      });
    }
  );