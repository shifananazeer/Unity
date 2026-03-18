import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { sendMessage , getMessages } from "../controllers/chatController";
const router = express.Router();

router.post("/send", authMiddleware(["user"]), sendMessage);
router.get("/:receiverId", authMiddleware(["user"]), getMessages);

export default router;