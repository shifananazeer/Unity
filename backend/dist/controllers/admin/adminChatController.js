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
exports.getMessagesAdmin = exports.sendMessageAdmin = void 0;
const Message_1 = __importDefault(require("../../models/Message"));
const socket_1 = require("../../socket");
// Send message from admin to any receiver
const sendMessageAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = req.user.id; // admin id
        const { receiverId, text } = req.body;
        if (!receiverId || !text)
            return res.status(400).json({ message: "receiverId and text required" });
        const message = yield Message_1.default.create({
            sender,
            receiver: receiverId,
            text,
            senderRole: "admin",
            receiverRole: "user", // admin always talks to users
        });
        // Emit via socket
        const io = (0, socket_1.getIO)();
        io.to(receiverId).emit("receiveMessage", {
            _id: message._id.toString(),
            sender,
            senderRole: "admin",
            receiver: receiverId,
            receiverRole: "user",
            text,
            createdAt: message.createdAt,
        });
        res.status(201).json(message);
    }
    catch (err) {
        console.error("Admin send message error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.sendMessageAdmin = sendMessageAdmin;
// Get messages between admin and a user
const getMessagesAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const { receiverId } = req.params;
        const messages = yield Message_1.default.find({
            $or: [
                { sender: adminId, receiver: receiverId },
                { sender: receiverId, receiver: adminId },
            ],
        }).sort({ createdAt: 1 });
        res.json(messages.map(m => ({
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
        console.error("Admin get messages error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getMessagesAdmin = getMessagesAdmin;
