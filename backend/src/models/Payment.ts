import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;    // Reference to User
  orderId: string;                    // Razorpay order ID
  paymentId?: string;                 // Razorpay payment ID after success
  amount: number;                     // in paise
  month: string;                      // e.g., "2026-03"
  status: "created" | "paid" | "failed" | "submitted"; // payment status
  screenshot?: string;                // URL/path to uploaded proof
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    status: { type: String, enum: ["created", "paid", "failed" , "submitted"], default: "created" },
    screenshot: { type: String },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;