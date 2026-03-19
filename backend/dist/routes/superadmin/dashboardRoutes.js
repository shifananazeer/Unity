"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const dashboardController_1 = require("../../controllers/superadmin/dashboardController");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const router = express_1.default.Router();
/* Multer Storage */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path_1.default.extname(file.originalname);
        cb(null, uniqueName);
    },
});
/* Multer Instance */
const upload = (0, multer_1.default)({ storage });
router.get("/dashboard/stats", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getDashboardStats);
router.get("/users", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getAllUsers);
router.patch("/users/block/:id", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.toggleUserBlock);
router.post("/create-admin", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.createAdmin);
router.get("/admins", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getAllAdmins);
router.patch("/admins/block/:id", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.toggleAdminBlock);
router.get("/payments", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getAllPayments);
router.put("/update-admin/:id", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.updateAdmin);
/* QR Management */
router.get("/qr/latest", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getLatestQRCode);
router.post("/qr/upload", (0, authMiddleware_1.default)(["superadmin"]), upload.single("qr"), dashboardController_1.uploadQRCode);
router.get("/get-coordinators", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getCoordinators);
router.get("/admins/filter", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getAdmins);
router.get("/coordinator/:id", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.getCoordinatorById);
router.get("/profile", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.adminProfile);
router.put("/change-password", (0, authMiddleware_1.default)(["superadmin"]), dashboardController_1.changeAdminPassword);
exports.default = router;
