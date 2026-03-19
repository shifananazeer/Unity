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
exports.getUserPayments = exports.uploadProfilePic = exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../../models/Payment"));
// GET PROFILE
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("profile controller");
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: "Unauthorized: no user in request" });
        }
        const userId = req.user.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = yield User_1.default.findById(userId)
            .populate("coordinator", "fullName type") // ✅ ADD THIS
            .populate("admin", "fullName");
        console.log("userprofile", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProfile = getProfile;
// UPDATE PROFILE
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id;
        const { fullName, mobileNumber, pinCode, district, state, localBody } = req.body;
        const updatedData = {};
        if (fullName)
            updatedData.fullName = fullName;
        if (mobileNumber)
            updatedData.mobileNumber = mobileNumber;
        if (pinCode)
            updatedData.pinCode = pinCode;
        if (district)
            updatedData.district = district;
        if (state)
            updatedData.state = state;
        if (localBody)
            updatedData.localBody = localBody;
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
// UPLOAD PROFILE PIC
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: "No profile picture uploaded" });
        }
        const profilePicPath = `/uploads/profilePics/${req.file.filename}`;
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { profilePicUrl: profilePicPath }, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Profile picture updated successfully",
            user: updatedUser
        });
    }
    catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.uploadProfilePic = uploadProfilePic;
const getUserPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        console.log("Fetching payments for user ID:", userId);
        const payments = yield Payment_1.default.find({ userId }).sort({ createdAt: -1 });
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        console.log("Payments fetched for user:", payments);
        res.json({
            payments,
            totalAmount,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching payments" });
    }
});
exports.getUserPayments = getUserPayments;
