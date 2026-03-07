import express from "express";
import { getProfile, getUserPayments, updateProfile, uploadProfilePic } from "../../controllers/user/profileController";
import authMiddleware from "../../middleware/authMiddleware";
import upload from "../../middleware/uploadMiddleware";
const router = express.Router();



router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/profile/pic", authMiddleware, upload.single("profilePic"), uploadProfilePic);
router.get("/payments", authMiddleware, getUserPayments);


export default router;