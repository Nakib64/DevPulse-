"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIssue = exports.updateIssue = exports.getSingleIssue = exports.getAllIssues = exports.createIssue = void 0;
const AppError_1 = __importDefault(require("../../utils/AppError"));
const issues_repo_1 = require("./issues.repo");
const createIssue = async (payload) => {
    return await (0, issues_repo_1.createIssueIntoDB)(payload);
};
exports.createIssue = createIssue;
const getAllIssues = async (sort, type, status) => {
    const issues = await (0, issues_repo_1.getAllIssuesFromDB)(sort, type, status);
    const reporterIds = [
        ...new Set(issues.map((issue) => issue.reporter_id)),
    ];
    const reporters = await (0, issues_repo_1.getUsersByIdsFromDB)(reporterIds);
    const reporterMap = new Map();
    reporters.forEach((reporter) => {
        reporterMap.set(reporter.id, reporter);
    });
    const formattedIssues = issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterMap.get(issue.reporter_id),
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));
    return formattedIssues;
};
exports.getAllIssues = getAllIssues;
const getSingleIssue = async (id) => {
    const issue = await (0, issues_repo_1.getIssueByIdFromDB)(id);
    if (!issue) {
        throw new AppError_1.default(404, "Issue not found");
    }
    const reporters = await (0, issues_repo_1.getUsersByIdsFromDB)([issue.reporter_id]);
    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporters[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };
};
exports.getSingleIssue = getSingleIssue;
const updateIssue = async (id, payload, user) => {
    const issue = await (0, issues_repo_1.getIssueByIdFromDB)(id);
    if (!issue) {
        throw new AppError_1.default(404, "Issue not found");
    }
    // contributor permission
    if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
            throw new AppError_1.default(403, "Forbidden");
        }
        if (issue.status !== "open") {
            throw new AppError_1.default(409, "Cannot edit non-open issue");
        }
    }
    return await (0, issues_repo_1.updateIssueIntoDB)(id, payload);
};
exports.updateIssue = updateIssue;
const deleteIssue = async (id) => {
    const issue = await (0, issues_repo_1.getIssueByIdFromDB)(id);
    if (!issue) {
        throw new AppError_1.default(404, "Issue not found");
    }
    await (0, issues_repo_1.deleteIssueFromDB)(id);
};
exports.deleteIssue = deleteIssue;
