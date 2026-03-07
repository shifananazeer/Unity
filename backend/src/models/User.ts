import mongoose, { Document, Schema } from "mongoose";
import { time } from "node:console";

export interface IUser extends Document {
  fullName: string;
  mobileNumber: string;
  pinCode: string;
  district: string;
  state: string;
  localBody: string; // Panchayath / Corporation
  password: string;
  role?: string; // "user" or "admin"
  profilePic?: string;
}


const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  pinCode: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  localBody: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePic: { type: String },
}, { timestamps: true });


const User = mongoose.model<IUser>("User", UserSchema);

export default User;
