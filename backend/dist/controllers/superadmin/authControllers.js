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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const superadmin_1 = __importDefault(require("../../models/superadmin"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Admin auth routes loaded ✅");
    try {
        const { email, password } = req.body;
        bcryptjs_1.default.hash("Admin@123", 10).then(hash => {
            console.log("...................", hash);
        });
        console.log("Admin login request received:", { email, password });
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });
        // Trim email and query correct collection
        const admin = yield superadmin_1.default.findOne({ email: email.trim() });
        console.log("Admin found in DB:", admin);
        if (!admin)
            return res.status(404).json({ message: "Admin not found" });
        const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });
        const token = (0, generateToken_1.default)(admin._id.toString(), "superadmin");
        const _a = admin.toObject(), { password: pwd } = _a, adminData = __rest(_a, ["password"]);
        res.status(200).json({ message: "Login successful", admin: adminData, token });
    }
    catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.adminLogin = adminLogin;
