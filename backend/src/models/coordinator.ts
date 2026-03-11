import mongoose from "mongoose";

const coordinatorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
     role: {
      type: String,
      enum: ["coordinator"],
      default: "coordinator",
    },

    district: {
      type: String,
      required: true,
    },
     password: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["nano", "micro"],
      required: true,
    },

    pin: {
      type: String,
      default: null,
    },

    area: {
      type: String,
      default: null,
    },
    
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coordinator", coordinatorSchema);