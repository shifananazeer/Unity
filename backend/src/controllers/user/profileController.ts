import { Request, Response } from "express";
import User from "../../models/User";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

// GET PROFILE
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: no user in request" });
    }

    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// UPDATE PROFILE
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const { fullName, mobileNumber, pinCode, district, state, localBody } = req.body;

    const updatedData: any = {};

    if (fullName) updatedData.fullName = fullName;
    if (mobileNumber) updatedData.mobileNumber = mobileNumber;
    if (pinCode) updatedData.pinCode = pinCode;
    if (district) updatedData.district = district;
    if (state) updatedData.state = state;
    if (localBody) updatedData.localBody = localBody;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// UPLOAD PROFILE PIC
export const uploadProfilePic = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No profile picture uploaded" });
    }

    const profilePicPath = `/uploads/profilePics/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicUrl: profilePicPath },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};