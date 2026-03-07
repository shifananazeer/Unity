import { Request, Response } from "express";
import User from "../../models/User";
import Payment from "../../models/Payment";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {

    // Count users based on role from User collection
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalCoordinators = await User.countDocuments({ role: "coordinator" });

    // Payment stats
    const totalPayments = await Payment.countDocuments();

    const failedPayments = await Payment.countDocuments({ status: "failed" });

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalCoordinators,
      totalPayments,
      failedPayments,
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  console.log("Fetching all users for dashboard...");
  try {
    const users = await User.find().select("-password");
   console.log("Fetched users:", users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


export const toggleUserBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating user status" });
  }
};