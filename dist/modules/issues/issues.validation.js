"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateIssue = exports.validateCreateIssue = void 0;
const validateCreateIssue = (payload) => {
    const { title, description, type, } = payload;
    if (!title || !description || !type) {
        return "All fields are required";
    }
    if (title.length > 150) {
        return "Title cannot exceed 150 characters";
    }
    if (description.length < 20) {
        return "Description must be at least 20 characters";
    }
    if (type !== "bug" &&
        type !== "feature_request") {
        return "Invalid issue type";
    }
    return null;
};
exports.validateCreateIssue = validateCreateIssue;
const validateUpdateIssue = (payload) => {
    const { title, description, type, status, } = payload;
    if (title &&
        title.length > 150) {
        return "Title cannot exceed 150 characters";
    }
    if (description &&
        description.length < 20) {
        return "Description must be at least 20 characters";
    }
    if (type &&
        type !== "bug" &&
        type !== "feature_request") {
        return "Invalid issue type";
    }
    if (status &&
        status !== "open" &&
        status !== "in_progress" &&
        status !== "resolved") {
        return "Invalid issue status";
    }
    return null;
};
exports.validateUpdateIssue = validateUpdateIssue;
