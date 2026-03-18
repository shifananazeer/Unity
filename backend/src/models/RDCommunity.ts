// models/RDCommunity.ts
import mongoose from "mongoose";

const rdCommunitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RDCommunity", rdCommunitySchema);