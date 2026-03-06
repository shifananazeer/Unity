// routes/paymentRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();
import { createOrder , uploadScreenshot } from "../../controllers/user/paymentControllers";

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
router.post("/create-qr",createOrder);

// POST /payment/upload-screenshot
router.post("/upload-screenshot", upload.single("screenshot"), uploadScreenshot);

export default router;