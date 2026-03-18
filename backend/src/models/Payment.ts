import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;    // Reference to User
  amount: number;                     // in paise
  month: string;                      // e.g., "2026-03"
  status: "pending" | "paid" | "failed" | "submitted"; // payment status
  screenshot?: string;                // URL/path to uploaded proof
  paymentId?: string; 
  paidTo?:"coordinator"| "admin";
  nanoCoordinator:mongoose.Types.ObjectId;
  microCoordinator:mongoose.Types.ObjectId;             
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
     paidTo: {
    type: String,
    enum: ["coordinator", "admin"],
    required: true
  },
    paymentId: { type: String }, // for dynamic payments, optional for static QR
    nanoCoordinator: { type: mongoose.Schema.Types.ObjectId, ref: "Coordinator" },
   microCoordinator: { type: mongoose.Schema.Types.ObjectId, ref: "Coordinator" },
    status: { type: String, enum: ["pending", "paid", "failed" , "submitted"], default: "pending" },
    screenshot: { type: String },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;