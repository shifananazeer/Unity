"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profilePics"); // folder where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path_1.default.extname(file.originalname));
    },
});
// File filter (allow only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;
    const isValid = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase()) &&
        allowedTypes.test(file.mimetype);
    if (isValid) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});
exports.default = upload;
