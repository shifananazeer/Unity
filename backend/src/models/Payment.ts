import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;    // Reference to User
  amount: number;                     // in paise
  month: string;                      // e.g., "2026-03"
  status: "created" | "paid" | "failed" | "submitted"; // payment status
  screenshot?: string;                // URL/path to uploaded proof
  paymentId?: string;                // Razorpay payment ID (optional for static QR)
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    paymentId: { type: String }, // for dynamic payments, optional for static QR
    status: { type: String, enum: ["created", "paid", "failed" , "submitted"], default: "created" },
    screenshot: { type: String },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;