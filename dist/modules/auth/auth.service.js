"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const createUser = async (payload) => {
    const { name, email, password, role } = payload;
    const existingUserQuery = "SELECT * FROM users WHERE email = $1";
    const existingUser = await db_1.pool.query(existingUserQuery, [email]);
    if (existingUser.rows.length > 0) {
        throw new Error("user already exists with this email");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const insertUserQuery = `INSERT INTO users (
            name, email, password, role) VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at, updated_at`;
    const result = await db_1.pool.query(insertUserQuery, [name, email, hashedPassword, role || "contributor"]);
    return result.rows[0];
};
exports.createUser = createUser;
const loginUser = async (payload) => {
    const { email, password } = payload;
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const result = await db_1.pool.query(userQuery, [email]);
    const user = result.rows[0];
    if (!user) {
        throw new Error('Invalid email');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const token = (0, jwt_1.generateToken)({
        id: user.id,
        name: user.name,
        role: user.role
    });
    const response = user;
    return {
        token,
        user: response
    };
};
exports.loginUser = loginUser;
