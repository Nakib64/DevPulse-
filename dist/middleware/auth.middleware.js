"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // no token
        if (!token) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json({
                success: false,
                message: "Unauthorized access",
            });
        }
        // verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        // attach user
        req.user = decoded;
        next();
    }
    catch (error) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.default = auth;
