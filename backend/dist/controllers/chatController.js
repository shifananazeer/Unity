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
exports.getMessages = exports.sendMessage = void 0;
// controllers/chatController.ts
const Message_1 = __importDefault(require("../models/Message"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = req.user.id; // logged-in user/coordinator/admin
        const senderRole = req.user.role; // "user" | "coordinator" | "admin"
        const { receiverId, receiverRole, text } = req.body;
        if (!receiverId || !receiverRole || !text) {
            return res.status(400).json({ message: "receiverId, receiverRole, and text are required" });
        }
        const message = yield Message_1.default.create({
            sender,
            senderRole,
            receiver: receiverId,
            receiverRole,
            text,
        });
        // Emit message to receiver via socket
        const io = require("../socket").getIO();
        io.to(receiverId).emit("receiveMessage", {
            _id: message._id.toString(),
            sender,
            senderRole,
            receiver: receiverId,
            receiverRole,
            text: message.text,
            createdAt: message.createdAt,
        });
        res.status(201).json(message);
    }
    catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { receiverId } = req.params;
        const messages = yield Message_1.default.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId },
            ],
        }).sort({ createdAt: 1 });
        res.json(messages.map((m) => ({
            _id: m._id.toString(),
            sender: m.sender.toString(),
            senderRole: m.senderRole,
            receiver: m.receiver.toString(),
            receiverRole: m.receiverRole,
            text: m.text,
            createdAt: m.createdAt,
        })));
    }
    catch (err) {
        console.error("Get messages error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getMessages = getMessages;
