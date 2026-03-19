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
exports.confirmPayment = exports.getUpiDetails = exports.createPayment = exports.uploadScreenshot = exports.createOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../../models/Payment"));
const User_1 = __importDefault(require("../../models/User"));
const generatePaymentId = () => {
    return "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase();
};
// Create static QR payment record
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Received createOrder request with body:", req.body);
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("Fetching payments for user ID:", userId);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId from token" });
        }
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }
        // Fetch the user to get coordinator
        const user = yield User_1.default.findById(userId).select("coordinator");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        const paymentDate = `${year}-${month}-${day}`;
        // Generate random payment ID
        const paymentId = "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase();
        // Create payment with single coordinator reference
        const newPayment = new Payment_1.default({
            paymentId,
            userId,
            amount,
            month: paymentDate,
            status: "created",
            coordinator: user.coordinator, // single coordinator
        });
        yield newPayment.save();
        res.status(201).json({
            paymentId: newPayment.paymentId,
            amount,
            status: newPayment.status,
            message: "Payment record created successfully",
        });
    }
    catch (error) {
        console.error("Error creating payment record:", error);
        res.status(500).json({ error: "Failed to create payment record" });
    }
});
exports.createOrder = createOrder;
// Upload screenshot for existing payment
const uploadScreenshot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received uploadScreenshot request with file:", req.file);
    try {
        const { paymentId } = req.body; // frontend should send month or derive it
        const file = req.file;
        console.log("Payment ID from request body:", paymentId);
        if (!paymentId || !file) {
            return res.status(400).json({ message: "PaymentId and file are required" });
        }
        // ✅ Find payment by ID and update screenshot
        const payment = yield Payment_1.default.findOne({ paymentId });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        // Update screenshot and mark status as 'submitted'
        payment.screenshot = file.path; // store file path in DB
        payment.status = "submitted"; // optional
        yield payment.save();
        return res.status(200).json({
            message: "Screenshot uploaded successfully",
            payment,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload screenshot" });
    }
});
exports.uploadScreenshot = uploadScreenshot;
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, paidTo } = req.body;
        const userId = req.user.id;
        console.log("BODY:", req.body);
        console.log("USER:", req.user);
        const paymentId = "PAY-" + Math.floor(Math.random() * 1000000);
        const month = new Date().toISOString().split("T")[0];
        const payment = new Payment_1.default({
            userId,
            amount,
            paidTo,
            month,
            paymentId,
            status: "pending"
        });
        yield payment.save();
        res.json({
            message: "Payment created",
            paymentId
        });
    }
    catch (error) {
        res.status(500).json({ message: "Payment creation failed" });
    }
});
exports.createPayment = createPayment;
const getUpiDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield User_1.default.findById(userId)
            .populate("coordinator") // populate single coordinator
            .populate("admin"); // populate admin
        let coordinatorUpi = "";
        let adminUpi = "";
        // coordinator UPI
        if (user === null || user === void 0 ? void 0 : user.coordinator) {
            coordinatorUpi = user.coordinator.upiId || "";
        }
        // admin UPI
        if (user === null || user === void 0 ? void 0 : user.admin) {
            adminUpi = user.admin.upiId || "";
        }
        res.json({
            coordinatorUpi,
            adminUpi,
        });
    }
    catch (error) {
        console.error("Error fetching UPI details:", error);
        res.status(500).json({ message: "Failed to fetch UPI details" });
    }
});
exports.getUpiDetails = getUpiDetails;
const confirmPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentId } = req.body;
        const payment = yield Payment_1.default.findOneAndUpdate({ paymentId }, { status: "paid" }, { new: true });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json({
            message: "Payment confirmed",
            payment
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to confirm payment" });
    }
});
exports.confirmPayment = confirmPayment;
