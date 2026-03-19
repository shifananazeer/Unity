"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const coordinatorSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["coordinator"],
        default: "coordinator",
    },
    district: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    upiId: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: ["nano", "micro"],
        required: true,
    },
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "SecondAdmin",
    },
    pin: {
        type: String,
        default: null,
    },
    area: {
        type: String,
        default: null,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Coordinator", coordinatorSchema);
