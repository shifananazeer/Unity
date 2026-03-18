// routes/paymentRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();
import { createOrder , uploadScreenshot , createPayment , getUpiDetails , confirmPayment} from "../../controllers/user/paymentControllers";
import authMiddleware from "../../middleware/authMiddleware";

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });


// POST /payment/create-qr
router.post("/create-qr",authMiddleware(["user"]),createOrder);

router.post("/create",authMiddleware(["user"]), createPayment);

// POST /payment/upload-screenshot
router.post("/upload",authMiddleware(["user"]), upload.single("screenshot"), uploadScreenshot);

router.get("/upi-details", authMiddleware(["user"]), getUpiDetails);

router.patch("/confirm", authMiddleware(["user"]), confirmPayment);

export default router;