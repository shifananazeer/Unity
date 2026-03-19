"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/paymentRoutes.js
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const paymentControllers_1 = require("../../controllers/user/paymentControllers");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
// Multer setup
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});
const upload = (0, multer_1.default)({ storage });
// POST /payment/create-qr
router.post("/create-qr", (0, authMiddleware_1.default)(["user"]), paymentControllers_1.createOrder);
router.post("/create", (0, authMiddleware_1.default)(["user"]), paymentControllers_1.createPayment);
// POST /payment/upload-screenshot
router.post("/upload", (0, authMiddleware_1.default)(["user"]), upload.single("screenshot"), paymentControllers_1.uploadScreenshot);
router.get("/upi-details", (0, authMiddleware_1.default)(["user"]), paymentControllers_1.getUpiDetails);
router.patch("/confirm", (0, authMiddleware_1.default)(["user"]), paymentControllers_1.confirmPayment);
exports.default = router;
