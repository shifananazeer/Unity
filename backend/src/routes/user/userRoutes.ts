import express from "express";
import { getProfile, getUserPayments, updateProfile, uploadProfilePic } from "../../controllers/user/profileController";
import authMiddleware from "../../middleware/authMiddleware";
import upload from "../../middleware/uploadMiddleware";
import { joinCommunity , getCommunityStatus , getUpiDetails , joinRDCommunity , getRDStatus } from "../../controllers/user/userController";
import multer from "multer";
const router = express.Router();



router.get("/profile", authMiddleware(["user"]), getProfile);
router.put("/profile", authMiddleware(["user"]), updateProfile);
router.post("/profile/pic", authMiddleware(["user"]), upload.single("profilePic"), uploadProfilePic);
router.get("/payments", authMiddleware(["user"]), getUserPayments);
router.post( "/community/join",authMiddleware(["user"]), joinCommunity);
router.get("/community-status", authMiddleware(["user"]), getCommunityStatus);
router.get("/upi-details",authMiddleware(["user"]), getUpiDetails);
router.post("/rd/join", authMiddleware(["user"]), joinRDCommunity);
router.get("/rd/status",authMiddleware(["user"]), getRDStatus);




export default router;