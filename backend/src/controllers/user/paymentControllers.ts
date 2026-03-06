
import { Request, Response } from "express";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Payment from "../../models/Payment";
import jwt from "jsonwebtoken";

// Razorpay instance
const razorpay = new (Razorpay as any)({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create static QR payment record
export const createOrder = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    // 2️⃣ Verify token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = decoded.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId from token" });
    }

    // 3️⃣ Check if payment exists for this month
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const monthYear = `${year}-${month}`;

    const existingPayment = await Payment.findOne({ userId, month: monthYear });
    if (existingPayment) {
      return res.status(400).json({ error: "Payment for this month already exists" });
    }

    // 4️⃣ Save payment record
    const amount = 50; // fixed amount
    const newPayment = new Payment({
      userId,
      amount,
      month: monthYear,
      status: "created",
      orderId: null, 
    });

    await newPayment.save();

    res.status(200).json({
      amount,
      message: "Payment record created successfully",
    });
  } catch (error) {
    console.error("Error creating payment record:", error);
    res.status(500).json({ error: "Failed to create payment record" });
  }
};


// Upload screenshot for existing payment
export const uploadScreenshot = async (req: Request, res: Response) => {
  try {
    const { userId, month } = req.body; // frontend should send month or derive it
    if (!req.file) {
      return res.status(400).json({ error: "No screenshot uploaded" });
    }

    const screenshotPath = req.file.path; // saved by multer

    // Find payment record for user & month
    const payment = await Payment.findOne({ userId, month });
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // Update screenshot and mark status as 'submitted'
    payment.screenshot = screenshotPath;
    payment.status = "submitted";
    await payment.save();

    return res.status(200).json({
      message: "Screenshot uploaded successfully",
      payment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to upload screenshot" });
  }
};