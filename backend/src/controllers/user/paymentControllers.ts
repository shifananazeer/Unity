
import { Request, Response } from "express";
import mongoose from "mongoose";
import Payment from "../../models/Payment";
import User from "../../models/User";
import SecondAdmin from "../../models/admin"


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
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Fetching payments for user ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId from token" });
    }

    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Fetch the user to get coordinator
    const user = await User.findById(userId).select("coordinator");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const paymentDate = `${year}-${month}-${day}`;

    // Generate random payment ID
    const paymentId = "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create payment with single coordinator reference
    const newPayment = new Payment({
      paymentId,
      userId,
      amount,
      month: paymentDate,
      status: "created",
      coordinator: user.coordinator, // single coordinator
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

export const createPayment = async (req: Request, res: Response) => {
  try {

    const { amount, paidTo } = req.body;
    const userId = (req as any).user.id;

     console.log("BODY:", req.body);
    console.log("USER:", (req as any).user);

    const paymentId = "PAY-" + Math.floor(Math.random() * 1000000);
    const month = new Date().toISOString().split("T")[0];

    const payment = new Payment({
      userId,
      amount,
      paidTo,
      month,
      paymentId,
      status: "pending"
    });

    await payment.save();

    res.json({
      message: "Payment created",
      paymentId
    });

  } catch (error) {
    res.status(500).json({ message: "Payment creation failed" });
  }
};

export const getUpiDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId)
      .populate("coordinator") // populate single coordinator
      .populate("admin");      // populate admin

    let coordinatorUpi = "";
    let adminUpi = "";

    // coordinator UPI
    if (user?.coordinator) {
      coordinatorUpi = (user.coordinator as any).upiId || "";
    }

    // admin UPI
    if (user?.admin) {
      adminUpi = (user.admin as any).upiId || "";
    }

    res.json({
      coordinatorUpi,
      adminUpi,
    });
  } catch (error) {
    console.error("Error fetching UPI details:", error);
    res.status(500).json({ message: "Failed to fetch UPI details" });
  }
};

  

export const confirmPayment = async (req: Request, res: Response) => {
  try {

    const { paymentId } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: "paid" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      message: "Payment confirmed",
      payment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};