import mongoose from "mongoose";

const DirectSellingcommunityJoinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageName: {
      type: String,
      default: "Elements Unity",
    },
    Coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coordinator",
    },
    status: {
      type: String,
      default: "joined",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CommunityJoin", DirectSellingcommunityJoinSchema);