import express from "express";
import path from "path";
import multer from "multer";

import {
  getAllUsers,
  getDashboardStats,
  toggleUserBlock,
  createAdmin,
  getAllAdmins,
  toggleAdminBlock,
  getAllPayments,
  updateAdmin,
  getLatestQRCode,
  uploadQRCode,
  getCoordinators,
  getAdmins,
  getCoordinatorById,
  adminProfile,
  changeAdminPassword
} from "../../controllers/superadmin/dashboardController";

import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

/* Multer Storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

/* Multer Instance */
const upload = multer({ storage });

router.get("/dashboard/stats", authMiddleware(["superadmin"]), getDashboardStats);

router.get("/users", authMiddleware(["superadmin"]), getAllUsers);

router.patch("/users/block/:id", authMiddleware(["superadmin"]), toggleUserBlock);

router.post("/create-admin", authMiddleware(["superadmin"]), createAdmin);

router.get("/admins", authMiddleware(["superadmin"]), getAllAdmins);

router.patch("/admins/block/:id", authMiddleware(["superadmin"]), toggleAdminBlock);

router.get("/payments", authMiddleware(["superadmin"]), getAllPayments);

router.put("/update-admin/:id", authMiddleware(["superadmin"]), updateAdmin);

/* QR Management */
router.get("/qr/latest", authMiddleware(["superadmin"]), getLatestQRCode);

router.post("/qr/upload",authMiddleware(["superadmin"]),upload.single("qr"),uploadQRCode);

router.get("/get-coordinators",authMiddleware(["superadmin"]),getCoordinators);

router.get("/admins/filter" ,authMiddleware(["superadmin"]), getAdmins )

router.get("/coordinator/:id",authMiddleware(["superadmin"]) , getCoordinatorById);

router.get("/profile" , authMiddleware(["superadmin"]), adminProfile)

router.put( "/change-password",authMiddleware(["superadmin"]),changeAdminPassword);
export default router;