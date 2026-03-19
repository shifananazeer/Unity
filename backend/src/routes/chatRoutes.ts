import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { sendMessage , getMessages } from "../controllers/chatController";
import { sendMessageCoordinator , getMessagesCoordinator } from "../controllers/coordinator/coordinatorChatController";
import { getMessagesAdmin, sendMessageAdmin } from "../controllers/admin/adminChatController";
const router = express.Router();

router.post("/send", authMiddleware(["user"]), sendMessage);
router.get("/:receiverId", authMiddleware(["user"]), getMessages);

router.post("/usertoadmin/send", authMiddleware(["user"]), sendMessage);
router.get("/getUseradmin/:receiverId", authMiddleware(["user"]), getMessages);

router.post("/coordinator/send", authMiddleware(["coordinator"]), sendMessageCoordinator);
router.get("/coordinator/:receiverId", authMiddleware(["coordinator"]), getMessagesCoordinator);

router.post("/admin/send", authMiddleware(["admin"]), sendMessageAdmin);
router.get("/admin/:receiverId", authMiddleware(["admin"]), getMessagesAdmin);



export default router;