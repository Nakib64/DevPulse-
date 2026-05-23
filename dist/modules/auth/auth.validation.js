"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateSignup = void 0;
const validateSignup = (data) => {
    const { name, email, password, role } = data;
    if (!name || !email || !password) {
        return "All fields are required";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long";
    }
    if (role && role !== "contributor" && role !== "maintainer") {
        return "invalid role";
    }
    return null;
};
exports.validateSignup = validateSignup;
const validateLogin = (data) => {
    const { email, password } = data;
    if (!email || !password) {
        return "all fields are required";
    }
    return null;
};
exports.validateLogin = validateLogin;
