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
  coordinator:String;
  userCode:string;
  admin:string;
  referralCode:string;
   referredUsers: mongoose.Types.ObjectId[];
  isBlocked?: boolean;
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
 role: {
  type: String,
  enum: ["user", "coordinator", "admin", "superadmin"],
  default: "user"
},
coordinator: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Coordinator",
},
userCode: {
  type: String,
  unique: true,
},
  referralCode: {
    type: String,
    unique: true,
  },

  referredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
admin:{
   type: mongoose.Schema.Types.ObjectId,
  ref: "SecondAdmin",
},
isBlocked: {
  type: Boolean,
  default: false
},
  profilePic: { type: String },
}, { timestamps: true });


const User = mongoose.model<IUser>("User", UserSchema);

export default User;
