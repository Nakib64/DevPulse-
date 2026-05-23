"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const auth_validation_1 = require("./auth.validation");
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("./auth.service");
const signup = async (req, res) => {
    try {
        const invalid = (0, auth_validation_1.validateSignup)(req.body);
        if (invalid) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: invalid
            });
        }
        const user = await (0, auth_service_1.createUser)(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "user registration successful",
            data: user
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const invalid = (0, auth_validation_1.validateLogin)(req.body);
        if (invalid) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: invalid
            });
        }
        const result = await (0, auth_service_1.loginUser)(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "login successful",
            data: result
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message
        });
    }
};
exports.login = login;
