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
exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const coordinator_1 = __importDefault(require("../../models/coordinator"));
const admin_1 = __importDefault(require("../../models/admin"));
const generateUserCode_1 = require("../../utils/generateUserCode");
const generateReferralCode_1 = require("../../utils/generateReferralCode");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, mobileNumber, pinCode, district, state, localBody, password, type, referralCode, } = req.body;
        if (!fullName || !mobileNumber || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingUser = yield User_1.default.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        let coordinatorId = null;
        // ✅ Assign coordinator
        if (type === "nano") {
            const nanoCoordinator = yield coordinator_1.default.findOne({
                type: "nano",
                pin: pinCode,
            });
            coordinatorId = nanoCoordinator === null || nanoCoordinator === void 0 ? void 0 : nanoCoordinator._id;
        }
        if (type === "micro") {
            const microCoordinator = yield coordinator_1.default.findOne({
                type: "micro",
                area: localBody,
            });
            coordinatorId = microCoordinator === null || microCoordinator === void 0 ? void 0 : microCoordinator._id;
        }
        // ✅ Find admin
        const admin = yield admin_1.default.findOne({ district });
        // ✅ Generate referral code (UNIQUE)
        const newReferralCode = yield (0, generateReferralCode_1.generateReferralCode)();
        // ✅ Generate user code
        const userCode = yield (0, generateUserCode_1.getNextUserCode)();
        const newUser = new User_1.default({
            fullName,
            mobileNumber,
            pinCode,
            district,
            state,
            localBody,
            password: hashedPassword,
            type,
            coordinator: coordinatorId,
            admin: admin === null || admin === void 0 ? void 0 : admin._id,
            userCode,
            referralCode: newReferralCode,
        });
        yield newUser.save();
        // ✅ HANDLE REFERRAL (BEFORE RESPONSE)
        if (referralCode) {
            const referrer = yield User_1.default.findOne({ referralCode });
            if (!referrer) {
                return res.status(400).json({ message: "Invalid referral code" });
            }
            // ✅ Prevent self-referral (extra safety)
            if (referrer._id.toString() !== newUser._id.toString()) {
                referrer.referredUsers.push(newUser._id);
                yield referrer.save();
            }
        }
        const token = (0, generateToken_1.default)(newUser._id.toString(), "user");
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
            token,
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, password } = req.body;
        // Find the user by mobile number
        const user = yield User_1.default.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the password is correct
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = (0, generateToken_1.default)(user._id.toString(), "user");
        res.status(200).json({ message: "Login successful", user, token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
