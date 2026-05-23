"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Application entry point
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const notFound_middleware_1 = __importDefault(require("./middleware/notFound.middleware"));
const issues_route_1 = __importDefault(require("./modules/issues/issues.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_route_1.default);
app.use("/api/issues", issues_route_1.default);
app.use(notFound_middleware_1.default);
exports.default = app;
