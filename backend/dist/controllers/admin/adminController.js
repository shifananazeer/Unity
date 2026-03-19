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
exports.changeAdminPassword = exports.adminProfile = exports.removeUser = exports.getAdminMissedPayments = exports.getCoordinatorsByAdmin = exports.getUpi = exports.updateAdminUpi = exports.getAdminDistrictPayments = exports.toggleCoordinatorBlock = exports.updateCoordinator = exports.getCoordinators = exports.createCoordinator = exports.blockUser = exports.getUserBasedOnDistrict = exports.getAdminDashboardStats = exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_1 = __importDefault(require("../../models/admin"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const User_1 = __importDefault(require("../../models/User"));
const coordinator_1 = __importDefault(require("../../models/coordinator"));
const Payment_1 = __importDefault(require("../../models/Payment"));
const dayjs_1 = __importDefault(require("dayjs"));
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
const CommunityJoin_1 = __importDefault(require("../../models/CommunityJoin"));
const RDCommunity_1 = __importDefault(require("../../models/RDCommunity"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find admin by email
        const admin = yield admin_1.default.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // Check if password matches
        const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = (0, generateToken_1.default)(admin._id.toString(), "admin");
        res.status(200).json({ message: "Login successful", admin, token });
    }
    catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.adminLogin = adminLogin;
const getAdminDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const authHeader = req.headers.authorization;
        console.log("Auth Header:", authHeader);
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // 1️⃣ Total users under this admin
        const totalUsers = yield User_1.default.countDocuments({ admin: adminId });
        // 2️⃣ Total coordinators under this admin
        const totalCoordinators = yield coordinator_1.default.countDocuments({ admin: adminId });
        // 3️⃣ Get all user IDs under this admin
        const users = yield User_1.default.find({ admin: adminId }).select("_id");
        const userIds = users.map((u) => u._id);
        // 4️⃣ Community counts (filtered by admin users)
        const totalDirectSellingUsers = yield CommunityJoin_1.default.countDocuments({
            userId: { $in: userIds },
        });
        const totalRDUsers = yield RDCommunity_1.default.countDocuments({
            user: { $in: userIds },
        });
        // 5️⃣ Payments aggregation (ONLY paid & pending)
        const payments = yield Payment_1.default.aggregate([
            {
                $match: {
                    userId: { $in: userIds },
                    status: { $in: ["paid", "pending"] },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        let totalPayments = 0; // ✅ only paid
        let failedPayments = 0; // ✅ pending
        payments.forEach((p) => {
            if (p._id === "paid") {
                totalPayments = p.count;
            }
            else if (p._id === "pending") {
                failedPayments = p.count;
            }
        });
        console.log("redCount ..........................", totalRDUsers);
        // ✅ Final response
        res.json({
            totalUsers,
            totalCoordinators,
            totalPayments,
            failedPayments,
            totalDirectSellingUsers,
            totalRDUsers,
        });
    }
    catch (error) {
        console.error("Admin dashboard stats error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAdminDashboardStats = getAdminDashboardStats;
const getUserBasedOnDistrict = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;
        // Get admin district
        const admin = yield admin_1.default.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // Search filter
        const searchFilter = {
            district: admin.district,
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        };
        // Get users with coordinator populated
        const users = yield User_1.default.find(searchFilter)
            .populate("coordinator", "fullName type") // <--- populate coordinator
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalUsers = yield User_1.default.countDocuments(searchFilter);
        res.json({
            users,
            totalUsers,
            page,
            totalPages: Math.ceil(totalUsers / limit),
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserBasedOnDistrict = getUserBasedOnDistrict;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findById(id);
        console.log("blocking User ", user);
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
exports.blockUser = blockUser;
const createCoordinator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, mobileNumber, email, password, district, type, pin, area } = req.body;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        console.log("Incoming district:", district);
        const admin = yield admin_1.default.findOne({
            district: { $regex: new RegExp(`^${district}$`, "i") },
        });
        console.log("Found admin:", admin);
        if (!admin) {
            return res.status(404).json({
                message: "No admin found for this district",
            });
        }
        const coordinator = new coordinator_1.default({
            fullName,
            mobileNumber,
            email,
            password: hashedPassword,
            district,
            type,
            pin,
            area,
            admin: admin._id,
        });
        console.log("coo..........................", coordinator);
        yield coordinator.save();
        res.status(201).json({
            success: true,
            message: "Coordinator created successfully",
            coordinator,
        });
    }
    catch (error) {
        console.error("CREATE COORDINATOR ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.createCoordinator = createCoordinator;
const getCoordinators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;
        // Get admin district
        const admin = yield admin_1.default.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // Search filter
        const searchFilter = {
            district: admin.district,
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };
        // Get coordinators
        const coordinators = yield coordinator_1.default.find(searchFilter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalCoordinators = yield coordinator_1.default.countDocuments(searchFilter);
        console.log("Coordinators", coordinators);
        res.json({
            coordinators,
            totalCoordinators,
            page,
            totalPages: Math.ceil(totalCoordinators / limit)
        });
    }
    catch (error) {
        console.error("Error fetching coordinators:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCoordinators = getCoordinators;
const updateCoordinator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fullName, phone, email, password, district, type, pin, area } = req.body;
        const coordinator = yield coordinator_1.default.findById(id);
        if (!coordinator) {
            return res.status(404).json({ message: "Coordinator not found" });
        }
        // Update basic fields
        coordinator.fullName = fullName || coordinator.fullName;
        coordinator.mobileNumber = phone || coordinator.mobileNumber;
        coordinator.email = email || coordinator.email;
        coordinator.district = district || coordinator.district;
        coordinator.type = type || coordinator.type;
        coordinator.pin = type === "nano" ? pin : null;
        coordinator.area = type === "micro" ? area : null;
        // Hash password ONLY if it was changed
        if (password) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            coordinator.password = hashedPassword;
        }
        yield coordinator.save();
        res.status(200).json({
            message: "Coordinator updated successfully",
            coordinator,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating coordinator" });
    }
});
exports.updateCoordinator = updateCoordinator;
const toggleCoordinatorBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("coordinatorId", id);
        const user = yield coordinator_1.default.findById(id);
        console.log("Toggling block for Coordinator:", user);
        if (!user)
            return res.status(404).json({ message: "coordinator not found" });
        user.isBlocked = !user.isBlocked;
        yield user.save();
        res.status(200).json({
            message: user.isBlocked ? "Coordinator blocked" : "Coordinator unblocked",
            user
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Coordinator status" });
    }
});
exports.toggleCoordinatorBlock = toggleCoordinatorBlock;
const getAdminDistrictPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const admin = yield admin_1.default.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const district = admin.district;
        console.log("Admin district:", district);
        // Get all users in this district
        const users = yield User_1.default.find({ district }).select("_id");
        console.log("Users found:", users);
        const userIds = users.map((u) => u._id);
        console.log("User IDs:", userIds);
        // Fetch payments for these users and populate user info + coordinator info
        const payments = yield Payment_1.default.find({
            userId: { $in: userIds },
        }).populate({
            path: "userId",
            select: "fullName mobileNumber district coordinator",
            populate: {
                path: "coordinator",
                select: "fullName mobileNumber type", // you can select other fields if needed
            },
        });
        console.log("Payments found:", payments);
        res.status(200).json({ payments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching payments" });
    }
});
exports.getAdminDistrictPayments = getAdminDistrictPayments;
const updateAdminUpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log("Admin ID:", adminId);
        const { upiId } = req.body;
        const admin = yield admin_1.default.findByIdAndUpdate(adminId, { upiId }, { returnDocument: "after" });
        res.json({
            message: "UPI updated successfully",
            admin
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating UPI" });
    }
});
exports.updateAdminUpi = updateAdminUpi;
const getUpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const admin = yield admin_1.default.findById(adminId).select("upiId");
        res.json({
            upiId: (admin === null || admin === void 0 ? void 0 : admin.upiId) || ""
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching UPI" });
    }
});
exports.getUpi = getUpi;
const getCoordinatorsByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id; // Admin ID from JWT
        // Find coordinators where admin field matches this admin
        const coordinators = yield coordinator_1.default.find({ admin: adminId }).select("_id fullName type");
        console.log("coo details...................................................", coordinators);
        res.status(200).json(coordinators);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching coordinators" });
    }
});
exports.getCoordinatorsByAdmin = getCoordinatorsByAdmin;
dayjs_1.default.extend(isSameOrAfter_1.default);
const getAdminMissedPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // ✅ 1️⃣ Get all users under this admin
        const users = yield User_1.default.find({ admin: adminId })
            .populate("coordinator", "fullName type")
            .populate("admin", "fullName")
            .select("_id fullName mobileNumber coordinator admin");
        // ✅ 2️⃣ Get all payments for these users
        const userIds = users.map((u) => u._id);
        const payments = yield Payment_1.default.find({
            userId: { $in: userIds },
        }).select("userId month status");
        // ✅ 3️⃣ Map payments by user
        const paymentsMap = new Map();
        payments.forEach((p) => {
            const key = p.userId.toString();
            if (!paymentsMap.has(key))
                paymentsMap.set(key, []);
            paymentsMap.get(key).push(p);
        });
        // ✅ 4️⃣ Calculate consecutive missed months
        const result = users
            .map((user) => {
            var _a, _b;
            const userPayments = paymentsMap.get(user._id.toString()) || [];
            const firstPaymentMonth = userPayments.length
                ? (0, dayjs_1.default)(userPayments.reduce((min, p) => (p.month < min ? p.month : min), userPayments[0].month) + "-01")
                : null;
            let consecutiveMissed = 0;
            if (firstPaymentMonth) {
                let monthCursor = (0, dayjs_1.default)();
                while (monthCursor.isSameOrAfter(firstPaymentMonth, "month")) {
                    const monthStr = monthCursor.format("YYYY-MM");
                    const paid = userPayments.find((p) => p.month === monthStr && p.status === "paid");
                    if (!paid) {
                        consecutiveMissed++;
                    }
                    else {
                        break;
                    }
                    monthCursor = monthCursor.subtract(1, "month");
                }
            }
            else {
                consecutiveMissed = 0;
            }
            return {
                _id: user._id.toString(),
                fullName: user.fullName,
                mobileNumber: user.mobileNumber,
                coordinator: user.coordinator
                    ? {
                        _id: (_a = user.coordinator._id) === null || _a === void 0 ? void 0 : _a.toString(),
                        fullName: user.coordinator.fullName || "N/A",
                        type: user.coordinator.type,
                    }
                    : undefined,
                admin: user.admin
                    ? {
                        _id: (_b = user.admin._id) === null || _b === void 0 ? void 0 : _b.toString(),
                        fullName: user.admin.fullName || "N/A",
                    }
                    : undefined,
                missedMonths: consecutiveMissed,
            };
        })
            .filter((u) => u.missedMonths >= 1);
        console.log("Admin Missed Payments:", result);
        res.status(200).json({ users: result });
    }
    catch (error) {
        console.error("Error fetching admin missed payments:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAdminMissedPayments = getAdminMissedPayments;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield User_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: "User removed successfully" });
    }
    catch (error) {
        console.error("Error removing user:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.removeUser = removeUser;
const adminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const profile = yield admin_1.default.findById(adminId).select("-password");
        if (!profile) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Admin profile error:", error);
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
        const admin = yield admin_1.default.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
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
