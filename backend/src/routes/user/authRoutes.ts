import express from "express";
import { signup, login } from "../../controllers/user/authController";
import { getProfile, updateProfile, uploadProfilePic  }from "../../controllers/user/profileController";
import authMiddleware from "../../middleware/authMiddleware";
import upload from "../../middleware/uploadMiddleware";
const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);


export default router;