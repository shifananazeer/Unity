import mongoose from "mongoose";

const qrSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  amount: { type: Number, default: 50 }, // optional default amount
  createdAt: { type: Date, default: Date.now }
});

export const QRCode = mongoose.model("QRCode", qrSchema);