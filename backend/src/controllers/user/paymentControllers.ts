
import { Request, Response } from "express";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Payment from "../../models/Payment";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const generatePaymentId = () => {
  return "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Create static QR payment record
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  console.log("Received createOrder request with body:", req.body);
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
     const userId = req.user?.id;
     console.log("Fetching payments for user ID:", userId);


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId from token" });
    }

    // Get amount from frontend
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

   const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const monthYear = `${year}-${month}`;

    // generate random payment id
    const paymentId = "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const newPayment = new Payment({
      paymentId,
      userId,
      amount,
      month: monthYear,
      status: "created",
    });

    await newPayment.save();

    res.status(201).json({
      paymentId: newPayment.paymentId,
      amount,
      status: newPayment.status,
      message: "Payment record created successfully",
    });

  } catch (error) {
    console.error("Error creating payment record:", error);
    res.status(500).json({ error: "Failed to create payment record" });
  }
};


// Upload screenshot for existing payment
export const uploadScreenshot = async (req: Request, res: Response) => {
  console.log("Received uploadScreenshot request with file:", req.file);
  try {
 const { paymentId } = req.body; // frontend should send month or derive it
    const file = req.file;
    console.log("Payment ID from request body:", paymentId);

      if (!paymentId || !file) {
        return res.status(400).json({ message: "PaymentId and file are required" });
      }

      // ✅ Find payment by ID and update screenshot
      const payment = await Payment.findOne({ paymentId });
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

    // Update screenshot and mark status as 'submitted'
    payment.screenshot = file.path; // store file path in DB
      payment.status = "submitted"; // optional
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

