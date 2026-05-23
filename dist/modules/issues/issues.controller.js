"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIssue = exports.updateIssue = exports.getSingleIssue = exports.getAllIssues = exports.createIssue = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const issues_validation_1 = require("./issues.validation");
const IssueService = __importStar(require("./issues.service"));
exports.createIssue = (0, catchAsync_1.default)(async (req, res, next) => {
    const validationError = (0, issues_validation_1.validateCreateIssue)(req.body);
    if (validationError) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({
            success: false,
            message: validationError,
        });
        return;
    }
    const payload = {
        ...req.body,
        reporter_id: req.user?.id,
    };
    const result = await IssueService.createIssue(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Issue created successfully",
        data: result,
    });
});
exports.getAllIssues = (0, catchAsync_1.default)(async (req, res, next) => {
    const { sort = "newest", type, status, } = req.query;
    const result = await IssueService.getAllIssues(sort, type, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Issues retrieved successfully",
        data: result,
    });
});
exports.getSingleIssue = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await IssueService.getSingleIssue(Number(req.params.id));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Issue retrieved successfully",
        data: result,
    });
});
exports.updateIssue = (0, catchAsync_1.default)(async (req, res, next) => {
    const validationError = (0, issues_validation_1.validateUpdateIssue)(req.body);
    if (validationError) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({
            success: false,
            message: validationError,
        });
        return;
    }
    const result = await IssueService.updateIssue(Number(req.params.id), req.body, {
        id: req.user?.id ?? 0,
        role: req.user?.role ?? "contributor",
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Issue updated successfully",
        data: result,
    });
});
exports.deleteIssue = (0, catchAsync_1.default)(async (req, res, next) => {
    await IssueService.deleteIssue(Number(req.params.id));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Issue deleted successfully",
    });
});
