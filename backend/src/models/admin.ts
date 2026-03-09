import mongoose, { Schema, Document } from "mongoose";
import { ISuperAdmin } from "./superadmin";

export interface ISecondAdmin extends Document {
  fullName?: string;
  phone?: string;
  district?: string;
  password: string;
  role?: string;
   isBlocked?: boolean;
}

const SecondAdminSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISecondAdmin>(
  "SecondAdmin",
  SecondAdminSchema,
  "secondadmin" // collection name
);