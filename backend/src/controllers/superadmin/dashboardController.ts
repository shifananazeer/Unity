import { Request, Response } from "express";
import User from "../../models/User";
import Payment from "../../models/Payment";
import SecondAdmin from "../../models/admin";
import bcrypt from "bcryptjs";
import { QRCode } from "../../models/qrCode";
import Coordinator from "../../models/coordinator";
import coordinator from "../../models/coordinator";
export const getDashboardStats = async (req: Request, res: Response) => {
  try {

    // Count users based on role from User collection
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalAdmins = await SecondAdmin.countDocuments({ role: "admin" });

    const totalCoordinators = await Coordinator.countDocuments({ role: "coordinator" });

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

    // Search query for fullName, mobileNumber, or district
    const query = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(query)
      .select("-password")
      .populate("coordinator", "fullName type") // single coordinator with type
      .populate("admin", "fullName") // admin
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    console.log("Fetched users:", users);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error("Error fetching users:", error);
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
    const { fullName, phone,email, district, password } = req.body;

    // hash password
     const  hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new SecondAdmin({
      fullName,
      phone,
      email,
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
    const payments = await Payment.find()
      .populate({
        path: "userId",
        select: "fullName mobileNumber district admin coordinator",
        populate: [
          { path: "admin", select: "fullName" },
          { path: "coordinator", select: "fullName type" }, // single coordinator now
        ],
      })
      .sort({ createdAt: -1 });

    console.log("Fetched payments:", payments);
    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetch payments error:", error);
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phone, district } = req.body;
    const admin = await SecondAdmin.findById(id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.fullName = fullName || admin.fullName;
    admin.mobileNumber = phone || admin.mobileNumber;
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

export const uploadQRCode = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { amount } = req.body;

    if (!file) {
      return res.status(400).json({ message: "QR image is required" });
    }

    const imageUrl = `/uploads/${file.filename}`;

    const newQR = new QRCode({
      imageUrl,
      amount: amount || 50,
    });

    await newQR.save();

    res.status(201).json({
      message: "QR Code uploaded successfully",
      qr: newQR,
    });
  } catch (error) {
    console.error("Upload QR error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLatestQRCode = async (req: Request, res: Response) => {
  try {
    const qr = await QRCode.findOne().sort({ createdAt: -1 });

    if (!qr) {
      return res.status(404).json({ message: "No QR code found" });
    }

    res.status(200).json(qr);
  } catch (error) {
    console.error("Get QR error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCoordinators = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    let query: any = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { district: { $regex: search, $options: "i" } },
        ],
      };
    }

    const coordinators = await Coordinator.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Coordinator.countDocuments(query);

    console.log("Fetched coordinators:", coordinators);

    res.status(200).json({
      coordinators,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Fetch coordinators error:", error);
    res.status(500).json({ message: "Failed to fetch coordinators" });
  }
};



export const getAdmins = async (req: Request, res: Response) => {
  try {
    // Fetch all admins
    const admins = await SecondAdmin.find().select(
      "_id fullName district isBlocked role"
    );

    // Send as an object with admins array
    res.status(200).json({
      admins,        // array of admins
      totalPages: 1, // optional pagination
      currentPage: 1
    });
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

export const getCoordinatorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Coordinator ID is required" });

    const coordinator = await Coordinator.findById(id).select("fullName type");

    if (!coordinator) return res.status(404).json({ message: "Coordinator not found" });

    res.status(200).json(coordinator);
  } catch (error) {
    console.error("Error fetching coordinator:", error);
    res.status(500).json({ message: "Failed to fetch coordinator" });
  }
};