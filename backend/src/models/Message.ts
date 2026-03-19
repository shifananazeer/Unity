// models/Message.ts
import mongoose from "mongoose";

export type Role = "user" | "coordinator" | "admin";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderRole", // dynamically reference correct collection
    },
    senderRole: {
      type: String,
      required: true,
      enum: ["user", "coordinator", "admin"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverRole", // dynamically reference correct collection
    },
    receiverRole: {
      type: String,
      required: true,
      enum: ["user", "coordinator", "admin"],
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);