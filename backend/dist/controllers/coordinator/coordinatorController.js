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
exports.getUserDetails = exports.sendCoordinatorMessage = exports.getCoordinatorMessages = exports.removeUser = exports.getMissedPayments = exports.getCoordinatorUpi = exports.updateCoordinatorUpi = exports.changeCoordinatorPassword = exports.coordinatorProfile = exports.getCoordinatorPayments = exports.blockUser = exports.getAssignedUsers = exports.getCoordinatorDashboardStats = exports.coordinatorLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const coordinator_1 = __importDefault(require("../../models/coordinator"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const User_1 = __importDefault(require("../../models/User"));
const Payment_1 = __importDefault(require("../../models/Payment"));
const CommunityJoin_1 = __importDefault(require("../../models/CommunityJoin"));
// @ts-ignore
const dayjs_1 = __importDefault(require("dayjs"));
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
const Message_1 = __importDefault(require("../../models/Message"));
const RDCommunity_1 = __importDefault(require("../../models/RDCommunity"));
const coordinatorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Coordinator login");
    const { email, password } = req.body;
    console.log("Email from request:", email);
    try {
        // Find admin by email
        const coordinator = yield coordinator_1.default.findOne({ email });
        if (!coordinator) {
            return res.status(404).json({ message: "Coordinator not found" });
        }
        // Check if password matches
        const isMatch = yield bcryptjs_1.default.compare(password, coordinator.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = (0, generateToken_1.default)(coordinator._id.toString(), "coordinator");
        res.status(200).json({ message: "Login successful", coordinator, token });
    }
    catch (error) {
        console.error("coordinator login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.coordinatorLogin = coordinatorLogin;
const getCoordinatorDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!coordinatorId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // 1️⃣ Total users under this coordinator
        const users = yield User_1.default.find({ coordinator: coordinatorId }).select("_id");
        const userIds = users.map((u) => u._id);
        const totalUsers = users.length;
        // 2️⃣ Payment stats (ONLY paid & pending)
        const paymentStats = yield Payment_1.default.aggregate([
            {
                $match: {
                    userId: { $in: userIds },
                    status: { $in: ["paid", "pending", "submitted"] }, // include submitted
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        let paidPayments = 0;
        let submittedPayments = 0;
        let failedPayments = 0;
        paymentStats.forEach((p) => {
            if (p._id === "paid") {
                paidPayments = p.count;
            }
            else if (p._id === "submitted") {
                submittedPayments = p.count;
            }
            else if (p._id === "pending") {
                failedPayments = p.count;
            }
        });
        // totalPayments = paid + submitted
        const totalPayments = paidPayments + submittedPayments;
        // 3️⃣ Direct Selling Community count
        const directSellingCount = yield CommunityJoin_1.default.countDocuments({
            userId: { $in: userIds },
        });
        // 4️⃣ RD Community count
        const rdCommunityCount = yield RDCommunity_1.default.countDocuments({
            user: { $in: userIds },
        });
        console.log("DSC", directSellingCount);
        // ✅ Final response
        res.json({
            totalUsers,
            totalPayments,
            failedPayments,
            totalDirectSellingUsers: directSellingCount,
            totalRDUsers: rdCommunityCount,
        });
    }
    catch (error) {
        console.error("Coordinator dashboard stats error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCoordinatorDashboardStats = getCoordinatorDashboardStats;
const getAssignedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!coordinatorId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Get coordinator details
        const coordinator = yield coordinator_1.default.findById(coordinatorId);
        if (!coordinator) {
            return res.status(404).json({ message: "Coordinator not found" });
        }
        // Fetch users assigned to this coordinator
        const users = yield User_1.default.find({ coordinator: coordinatorId })
            .select("-password")
            .sort({ createdAt: -1 });
        // Send users + coordinator type in response
        res.status(200).json({
            count: users.length,
            users,
            coordinatorType: coordinator.type,
        });
    }
    catch (error) {
        console.error("Error fetching assigned users:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAssignedUsers = getAssignedUsers;
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
const getCoordinatorPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!coordinatorId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Find all users under this coordinator
        const users = yield User_1.default.find({ coordinator: coordinatorId }).select("_id");
        const userIds = users.map((u) => u._id);
        // Fetch payments of those users
        const payments = yield Payment_1.default.find({ userId: { $in: userIds } })
            .populate("userId", "fullName mobileNumber coordinator") // include coordinator info
            .sort({ createdAt: -1 });
        res.status(200).json({
            count: payments.length,
            payments,
        });
    }
    catch (error) {
        console.error("Coordinator payments error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCoordinatorPayments = getCoordinatorPayments;
const coordinatorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!coordinatorId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const profile = yield coordinator_1.default.findById(coordinatorId).select("-password");
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
exports.coordinatorProfile = coordinatorProfile;
const changeCoordinatorPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { currentPassword, newPassword } = req.body;
        if (!coordinatorId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const coordinator = yield coordinator_1.default.findById(coordinatorId);
        if (!coordinator) {
            return res.status(404).json({ message: "Coordinator not found" });
        }
        // check current password
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, coordinator.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password incorrect" });
        }
        // hash new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        coordinator.password = hashedPassword;
        yield coordinator.save();
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.changeCoordinatorPassword = changeCoordinatorPassword;
const updateCoordinatorUpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log("Coordinator ID:", coordinatorId);
        const { upiId } = req.body;
        const coordinator = yield coordinator_1.default.findByIdAndUpdate(coordinatorId, { upiId }, { returnDocument: "after" });
        res.json({
            message: "UPI updated successfully",
            coordinator
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating UPI" });
    }
});
exports.updateCoordinatorUpi = updateCoordinatorUpi;
const getCoordinatorUpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coordinatorId = req.user.id;
        const coordinator = yield coordinator_1.default.findById(coordinatorId).select("upiId");
        res.json({
            upiId: (coordinator === null || coordinator === void 0 ? void 0 : coordinator.upiId) || ""
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching UPI" });
    }
});
exports.getCoordinatorUpi = getCoordinatorUpi;
dayjs_1.default.extend(isSameOrAfter_1.default);
const getMissedPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!coordinatorId)
            return res.status(401).json({ message: "Unauthorized" });
        // 1️⃣ Get all users under this coordinator
        const users = yield User_1.default.find({ coordinator: coordinatorId }).select("_id fullName mobileNumber coordinator admin");
        // 2️⃣ Get all payments for these users (no month limit)
        const userIds = users.map((u) => u._id);
        const payments = yield Payment_1.default.find({
            userId: { $in: userIds },
        }).select("userId month status");
        // 3️⃣ Map payments by user
        const paymentsMap = new Map();
        payments.forEach((p) => {
            const key = p.userId.toString();
            if (!paymentsMap.has(key))
                paymentsMap.set(key, []);
            paymentsMap.get(key).push(p);
        });
        // 4️⃣ Calculate consecutive missed months for each user
        const result = users
            .map((user) => {
            var _a, _b;
            const userPayments = paymentsMap.get(user._id.toString()) || [];
            // Find the earliest payment month for this user
            const firstPaymentMonth = userPayments.length
                ? (0, dayjs_1.default)(userPayments.reduce((min, p) => (p.month < min ? p.month : min), userPayments[0].month) + "-01")
                : null; // null if no payments
            let consecutiveMissed = 0;
            if (firstPaymentMonth) {
                let monthCursor = (0, dayjs_1.default)(); // start from current month
                while (monthCursor.isSameOrAfter(firstPaymentMonth, "month")) {
                    const monthStr = monthCursor.format("YYYY-MM");
                    const paid = userPayments.find((p) => p.month === monthStr && p.status === "paid");
                    if (!paid) {
                        consecutiveMissed++;
                    }
                    else {
                        break; // stop counting at the first paid month
                    }
                    monthCursor = monthCursor.subtract(1, "month");
                }
            }
            else {
                consecutiveMissed = 0; // no payments yet
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
            .filter((u) => u.missedMonths >= 1); // only include users with 1+ consecutive misses
        console.log("Missed Payments Result:", result);
        res.status(200).json({ users: result });
    }
    catch (error) {
        console.error("Error fetching missed payments:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getMissedPayments = getMissedPayments;
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
const getCoordinatorMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const coordinatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { userId } = req.query;
    try {
        const messages = yield Message_1.default.find({
            $or: [
                { sender: coordinatorId, receiver: userId },
                { sender: userId, receiver: coordinatorId },
            ],
        }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching messages", error: err });
    }
});
exports.getCoordinatorMessages = getCoordinatorMessages;
const sendCoordinatorMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sender = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { userId, text } = req.body;
    if (!userId || !text)
        return res.status(400).json({ message: "Missing fields" });
    try {
        const message = yield Message_1.default.create({ sender, receiver: userId, text });
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ message: "Error sending message", error: err });
    }
});
exports.sendCoordinatorMessage = sendCoordinatorMessage;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log("📥 Received ID:", userId);
        const user = yield User_1.default.findById(userId)
            .populate("referredUsers", "fullName mobileNumber")
            .populate("coordinator", "fullName")
            .populate("admin", "fullName");
        console.groupCollapsed("userDetals ", user);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user details" });
    }
});
exports.getUserDetails = getUserDetails;
