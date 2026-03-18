import mongoose, { Schema, Document } from "mongoose";
import { ISuperAdmin } from "./superadmin";

export interface ISecondAdmin extends Document {
  fullName?: string;
  mobileNumber?: string;
  email?: string
  district?: string;
  password: string;
  upiId:string;
  role?: string;
   isBlocked?: boolean;
}

const SecondAdminSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    email: {
      type : String,
       trim: true
    },
    district: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
      upiId: {
      type: String,
      default: ""
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