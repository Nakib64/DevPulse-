"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const authorizeRole = (...roles) => (req, res, next) => {
    // no user
    if (!req.user) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({
            success: false,
            message: "Unauthorized access",
        });
    }
    // role check
    if (!roles.includes(req.user.role)) {
        return res
            .status(http_status_codes_1.StatusCodes.FORBIDDEN)
            .json({
            success: false,
            message: "Forbidden",
        });
    }
    next();
};
exports.default = authorizeRole;
