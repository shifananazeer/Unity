"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Message.ts
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "senderRole", // dynamically reference correct collection
    },
    senderRole: {
        type: String,
        required: true,
        enum: ["user", "coordinator", "admin"],
    },
    receiver: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "receiverRole", // dynamically reference correct collection
    },
    receiverRole: {
        type: String,
        required: true,
        enum: ["user", "coordinator", "admin"],
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Message", messageSchema);
