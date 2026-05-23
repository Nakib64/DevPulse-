"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../utils/AppError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong";
    let errorDetails = "";
    // custom app error
    if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // postgres duplicate error
    else if ("code" in error &&
        error.code === "23505") {
        statusCode =
            http_status_codes_1.StatusCodes.BAD_REQUEST;
        message =
            "Duplicate value error";
        errorDetails = {
            code: error.code,
            detail: "code" in error && "detail" in error ? error.detail : undefined,
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
exports.default = globalErrorHandler;
