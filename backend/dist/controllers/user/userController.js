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
exports.getRDStatus = exports.joinRDCommunity = exports.getUpiDetails = exports.getCommunityStatus = exports.joinCommunity = void 0;
const CommunityJoin_1 = __importDefault(require("../../models/CommunityJoin"));
const User_1 = __importDefault(require("../../models/User"));
const coordinator_1 = __importDefault(require("../../models/coordinator"));
const admin_1 = __importDefault(require("../../models/admin"));
const RDCommunity_1 = __importDefault(require("../../models/RDCommunity"));
const joinCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { packageName } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const existing = yield CommunityJoin_1.default.findOne({ userId });
        if (existing) {
            return res.json({ message: "Already joined community" });
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const join = new CommunityJoin_1.default({
            userId,
            coordinator: user.coordinator,
            packageName,
            status: "joined",
        });
        yield join.save();
        res.json({
            message: `Successfully joined ${packageName} community`,
            join,
        });
    }
    catch (error) {
        console.error("Join community error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.joinCommunity = joinCommunity;
const getCommunityStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const joined = yield CommunityJoin_1.default.findOne({ userId });
        res.json({
            joined: !!joined,
            packageName: (joined === null || joined === void 0 ? void 0 : joined.packageName) || null
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCommunityStatus = getCommunityStatus;
const getUpiDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_1.default.findOne().select("upiId");
        const coordinator = yield coordinator_1.default.findOne().select("upiId");
        res.json({
            adminUpi: (admin === null || admin === void 0 ? void 0 : admin.upiId) || "",
            coordinatorUpi: (coordinator === null || coordinator === void 0 ? void 0 : coordinator.upiId) || ""
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching UPI details" });
    }
});
exports.getUpiDetails = getUpiDetails;
const joinRDCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { packageName } = req.body;
        const existing = yield RDCommunity_1.default.findOne({ user: userId });
        if (existing) {
            return res.status(400).json({ message: "Already joined RD community" });
        }
        const newEntry = new RDCommunity_1.default({
            user: userId,
            packageName,
        });
        yield newEntry.save();
        res.json({ message: "Joined RD community successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.joinRDCommunity = joinRDCommunity;
const getRDStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const existing = yield RDCommunity_1.default.findOne({ user: userId });
        res.json({
            joined: !!existing,
            packageName: (existing === null || existing === void 0 ? void 0 : existing.packageName) || null,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error" });
    }
});
exports.getRDStatus = getRDStatus;
