"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const qrSchema = new mongoose_1.default.Schema({
    imageUrl: { type: String, required: true },
    amount: { type: Number, default: 50 }, // optional default amount
    createdAt: { type: Date, default: Date.now }
});
exports.QRCode = mongoose_1.default.model("QRCode", qrSchema);
