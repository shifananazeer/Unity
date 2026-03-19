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
exports.changeAdminPassword = exports.adminProfile = exports.getCoordinatorById = exports.getAdmins = exports.getCoordinators = exports.getLatestQRCode = exports.uploadQRCode = exports.updateAdmin = exports.getAllPayments = exports.toggleAdminBlock = exports.getAllAdmins = exports.createAdmin = exports.toggleUserBlock = exports.getAllUsers = exports.getDashboardStats = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Payment_1 = __importDefault(require("../../models/Payment"));
const admin_1 = __importDefault(require("../../models/admin"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const qrCode_1 = require("../../models/qrCode");
const coordinator_1 = __importDefault(require("../../models/coordinator"));
const CommunityJoin_1 = __importDefault(require("../../models/CommunityJoin"));
const RDCommunity_1 = __importDefault(require("../../models/RDCommunity"));
const superadmin_1 = __importDefault(require("../../models/superadmin"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // User counts
        const totalUsers = yield User_1.default.countDocuments({ role: "user" });
        const totalAdmins = yield admin_1.default.countDocuments({ role: "admin" });
        const totalCoordinators = yield coordinator_1.default.countDocuments({ role: "coordinator" });
        // Community counts
        const totalDirectSellingUsers = yield CommunityJoin_1.default.countDocuments();
        const totalRDUsers = yield RDCommunity_1.default.countDocuments();
        // Payment stats
        const totalPayments = yield Payment_1.default.countDocuments();
        const failedPayments = yield Payment_1.default.countDocuments({ status: "pending" });
        console.log("stats", totalAdmins, totalCoordinators, totalDirectSellingUsers, totalRDUsers, totalPayments);
        res.status(200).json({
            totalUsers,
            totalAdmins,
            totalCoordinators,
            totalPayments,
            failedPayments,
            totalDirectSellingUsers,
            totalRDUsers,
        });
    }
    catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
});
exports.getDashboardStats = getDashboardStats;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching all users for dashboard...");
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const search = req.query.search || "";
        // Search query for fullName, mobileNumber, or district
        const query = {
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: search, $options: "i" } },
                { district: { $regex: search, $options: "i" } },
            ],
        };
        const users = yield User_1.default.find(query)
            .select("-password")
            .populate("coordinator", "fullName type") // single coordinator with type
            .populate("admin", "fullName") // admin
            .skip((page - 1) * limit)
            .limit(limit);
        const totalUsers = yield User_1.default.countDocuments(query);
        console.log("Fetched users:", users);
        res.status(200).json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});
exports.getAllUsers = getAllUsers;
const toggleUserBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.isBlocked = !user.isBlocked;
        yield user.save();
        res.status(200).json({
            message: user.isBlocked ? "User blocked" : "User unblocked",
            user
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user status" });
    }
});
exports.toggleUserBlock = toggleUserBlock;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, phone, email, district, password } = req.body;
        // hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newAdmin = new admin_1.default({
            fullName,
            phone,
            email,
            district,
            password: hashedPassword,
        });
        yield newAdmin.save();
        res.status(201).json({
            message: "Admin created successfully",
            admin: newAdmin,
        });
    }
    catch (error) {
        console.error("Create admin error:", error);
        res.status(500).json({ message: "Error creating admin" });
    }
});
exports.createAdmin = createAdmin;
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const search = req.query.search || "";
        const admins = yield admin_1.default.find({
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ],
        }).select("-password")
            .skip((page - 1) * limit)
            .limit(limit);
        console.log("Fetched admins:", admins);
        const totalAdmins = yield admin_1.default.countDocuments({
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { district: { $regex: search, $options: "i" } },
            ],
        });
        res.status(200).json({
            admins,
            totalPages: Math.ceil(totalAdmins / limit),
            currentPage: page,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch admins" });
    }
});
exports.getAllAdmins = getAllAdmins;
const toggleAdminBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield admin_1.default.findById(id);
        console.log("Toggling block for admin:", user);
        if (!user)
            return res.status(404).json({ message: "Admin not found" });
        user.isBlocked = !user.isBlocked;
        yield user.save();
        res.status(200).json({
            message: user.isBlocked ? "Admin blocked" : "Admin unblocked",
            user
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating admin status" });
    }
});
exports.toggleAdminBlock = toggleAdminBlock;
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield Payment_1.default.find()
            .populate({
            path: "userId",
            select: "fullName mobileNumber district admin coordinator",
            populate: [
                { path: "admin", select: "fullName" },
                { path: "coordinator", select: "fullName type" }, // single coordinator now
            ],
        })
            .sort({ createdAt: -1 });
        console.log("Fetched payments:", payments);
        res.status(200).json(payments);
    }
    catch (error) {
        console.error("Fetch payments error:", error);
        res.status(500).json({ message: "Failed to fetch payments", error });
    }
});
exports.getAllPayments = getAllPayments;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fullName, phone, district } = req.body;
        const admin = yield admin_1.default.findById(id);
        if (!admin)
            return res.status(404).json({ message: "Admin not found" });
        admin.fullName = fullName || admin.fullName;
        admin.mobileNumber = phone || admin.mobileNumber;
        admin.district = district || admin.district;
        yield admin.save();
        res.status(200).json({
            message: "Admin updated successfully",
            admin
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating admin" });
    }
});
exports.updateAdmin = updateAdmin;
const uploadQRCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const { amount } = req.body;
        if (!file) {
            return res.status(400).json({ message: "QR image is required" });
        }
        const imageUrl = `/uploads/${file.filename}`;
        const newQR = new qrCode_1.QRCode({
            imageUrl,
            amount: amount || 50,
        });
        yield newQR.save();
        res.status(201).json({
            message: "QR Code uploaded successfully",
            qr: newQR,
        });
    }
    catch (error) {
        console.error("Upload QR error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.uploadQRCode = uploadQRCode;
const getLatestQRCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qr = yield qrCode_1.QRCode.findOne().sort({ createdAt: -1 });
        if (!qr) {
            return res.status(404).json({ message: "No QR code found" });
        }
        res.status(200).json(qr);
    }
    catch (error) {
        console.error("Get QR error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getLatestQRCode = getLatestQRCode;
const getCoordinators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { district: { $regex: search, $options: "i" } },
                ],
            };
        }
        const coordinators = yield coordinator_1.default.find(query)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = yield coordinator_1.default.countDocuments(query);
        console.log("Fetched coordinators:", coordinators);
        res.status(200).json({
            coordinators,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.error("Fetch coordinators error:", error);
        res.status(500).json({ message: "Failed to fetch coordinators" });
    }
});
exports.getCoordinators = getCoordinators;
const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all admins
        const admins = yield admin_1.default.find().select("_id fullName district isBlocked role");
        // Send as an object with admins array
        res.status(200).json({
            admins, // array of admins
            totalPages: 1, // optional pagination
            currentPage: 1
        });
    }
    catch (err) {
        console.error("Error fetching admins:", err);
        res.status(500).json({ message: "Failed to fetch admins" });
    }
});
exports.getAdmins = getAdmins;
const getCoordinatorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ message: "Coordinator ID is required" });
        const coordinator = yield coordinator_1.default.findById(id).select("fullName type");
        if (!coordinator)
            return res.status(404).json({ message: "Coordinator not found" });
        res.status(200).json(coordinator);
    }
    catch (error) {
        console.error("Error fetching coordinator:", error);
        res.status(500).json({ message: "Failed to fetch coordinator" });
    }
});
exports.getCoordinatorById = getCoordinatorById;
const adminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const profile = yield superadmin_1.default.findById(adminId).select("-password");
        if (!profile) {
            return res.status(404).json({ message: "Coordinator not found" });
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Coordinator profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.adminProfile = adminProfile;
const changeAdminPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { currentPassword, newPassword } = req.body;
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const admin = yield superadmin_1.default.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Coordinator not found" });
        }
        // check current password
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password incorrect" });
        }
        // hash new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        admin.password = hashedPassword;
        yield admin.save();
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.changeAdminPassword = changeAdminPassword;
