import mongoose, { Schema, Document } from "mongoose";

export interface ISuperAdmin extends Document {
  fullName?: string;
  email: string;
  password: string;
  isActive: boolean;
}

const SuperAdminSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISuperAdmin>(
  "SuperAdmin",
  SuperAdminSchema,
  "superadmin" // collection name
);