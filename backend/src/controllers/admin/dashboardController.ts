import { Request, Response } from "express";
import User from "../../models/User";
import Payment from "../../models/Payment";
import SecondAdmin from "../../models/admin";
import bcrypt from "bcryptjs";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {

    // Count users based on role from User collection
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalAdmins = await SecondAdmin.countDocuments({ role: "admin" });

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const search = (req.query.search as string) || "";

    const users = await User.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    })
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ],
    });

    console.log("Fetched users:", users);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });

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


export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, district, password } = req.body;

    // hash password
     const  hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new SecondAdmin({
      fullName,
      phone,
      district,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
    });

  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Error creating admin" });
  }
};

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
     const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = (req.query.search as string) || "";

    const admins = await SecondAdmin.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }).select("-password")
      .skip((page - 1) * limit)
      .limit(limit);
      console.log("Fetched admins:", admins);

    const totalAdmins = await SecondAdmin.countDocuments({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      admins,
      totalPages: Math.ceil(totalAdmins / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

export const toggleAdminBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await SecondAdmin.findById(id);
    console.log("Toggling block for admin:", user);

    if (!user) return res.status(404).json({ message: "Admin not found" });

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: user.isBlocked ? "Admin blocked" : "Admin unblocked",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating admin status" });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};  

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phone, district } = req.body;
    const admin = await SecondAdmin.findById(id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.fullName = fullName || admin.fullName;
    admin.phone = phone || admin.phone;
    admin.district = district || admin.district;

    await admin.save();

    res.status(200).json({
      message: "Admin updated successfully",
      admin
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin" });
  }
};
