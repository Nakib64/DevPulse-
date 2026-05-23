"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../../middleware/role.middleware"));
const issues_controller_1 = require("./issues.controller");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.default, issues_controller_1.createIssue);
router.get("/", issues_controller_1.getAllIssues);
router.get("/:id", issues_controller_1.getSingleIssue);
router.patch("/:id", auth_middleware_1.default, issues_controller_1.updateIssue);
router.delete("/:id", auth_middleware_1.default, (0, role_middleware_1.default)("maintainer"), issues_controller_1.deleteIssue);
exports.default = router;
