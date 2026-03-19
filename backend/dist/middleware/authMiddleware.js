"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = __importDefault(require("../models/admin"));
const superadmin_1 = __importDefault(require("../models/superadmin"));
const User_1 = __importDefault(require("../models/User"));
const coordinator_1 = __importDefault(require("../models/coordinator"));
const authMiddleware = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "No token provided" });
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log("Decoded:", decoded);
            // ✅ 1. Check role from token FIRST
            if (!decoded.role || !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access denied" });
            }
            let userExists = false;
            // ✅ 2. Verify user exists in correct collection
            if (decoded.role === "superadmin") {
                userExists = !!(yield superadmin_1.default.findById(decoded.id));
            }
            if (decoded.role === "admin") {
                userExists = !!(yield admin_1.default.findById(decoded.id));
            }
            if (decoded.role === "user") {
                userExists = !!(yield User_1.default.findById(decoded.id));
            }
            if (decoded.role === "coordinator") {
                userExists = !!(yield coordinator_1.default.findById(decoded.id));
            }
            if (!userExists) {
                return res.status(403).json({ message: "User not found" });
            }
            console.log("Decoded:", decoded);
            req.role = decoded.role;
            next();
        }
        catch (error) {
            console.error("Auth error:", error);
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(401).json({ message: "Invalid token" });
        }
    });
};
exports.default = authMiddleware;
