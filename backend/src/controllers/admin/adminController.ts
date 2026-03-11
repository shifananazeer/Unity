import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import SecondAdmin from "../../models/admin";
import generateToken from "../../utils/generateToken";
import { AuthRequest } from "../../middleware/authMiddleware";
import User from "../../models/User"
import Coordinator from "../../models/coordinator";


export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Find admin by email
        const admin = await SecondAdmin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }   
        // Check if password matches
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = generateToken(admin._id.toString(), "admin");
        res.status(200).json({ message: "Login successful", admin, token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};


export const getAdminDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
   console.log("adminId" , adminId)
    // Find admin info
    const admin = await SecondAdmin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Total users in this admin's district/state
    const totalUsersInThisAdminsControl = await User.countDocuments({
      district: admin.district,
    });

    // // Optional: paid/unpaid users
    // const totalPaid = await User.countDocuments({
    //   district: admin.district,
    //   isPaid: true,
    // });

    // const totalUnpaid = await User.countDocuments({
    //   district: admin.district,
    //   isPaid: false,
    // });

    res.json({
      totalUsers: totalUsersInThisAdminsControl,
    //   totalPaid,
    //   totalUnpaid,
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserBasedOnDistrict = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    // Get admin district
    const admin = await SecondAdmin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Search filter
    const searchFilter = {
      district: admin.district,
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    // Get users
    const users = await User.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(searchFilter);

    res.json({
      users,
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit)
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const blockUser = async ( req: Request , res: Response) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        console.log("blocking User " , user)
        if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user
    })
    }catch (error) {
            res.status(500).json({ message: "Error updating user status" });
    }
}

export const createCoordinator = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email,password, district, type, pin, area } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);

    const coordinator = new Coordinator({
      fullName,
      phone,
      email,
      password:hashedPassword,
      district,
      type,
      pin,
      area,
    });

    await coordinator.save();

    res.status(201).json({
      success: true,
      message: "Coordinator created successfully",
      coordinator,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCoordinators = async (req: AuthRequest, res: Response) => {
 try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    // Get admin district
    const admin = await SecondAdmin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Search filter
    const searchFilter = {
      district: admin.district,
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    // Get coordinators
    const coordinators = await Coordinator.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCoordinators = await Coordinator.countDocuments(searchFilter);
console.log("Coordinators" , coordinators)
    res.json({
      coordinators,
      totalCoordinators,
      page,
      totalPages: Math.ceil(totalCoordinators / limit)
    });

  } catch (error) {
    console.error("Error fetching coordinators:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateCoordinator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phone, email, password, district, type, pin, area } = req.body;

    const coordinator = await Coordinator.findById(id);

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    // Update basic fields
    coordinator.fullName = fullName || coordinator.fullName;
    coordinator.phone = phone || coordinator.phone;
    coordinator.email = email || coordinator.email;
    coordinator.district = district || coordinator.district;
    coordinator.type = type || coordinator.type;

    coordinator.pin = type === "nano" ? pin : null;
    coordinator.area = type === "micro" ? area : null;

    // Hash password ONLY if it was changed
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      coordinator.password = hashedPassword;
    }

    await coordinator.save();

    res.status(200).json({
      message: "Coordinator updated successfully",
      coordinator,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating coordinator" });
  }
};


export const toggleCoordinatorBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("coordinatorId" , id)
    const user = await Coordinator.findById(id);
    console.log("Toggling block for Coordinator:", user);

    if (!user) return res.status(404).json({ message: "coordinator not found" });

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: user.isBlocked ? "Coordinator blocked" : "Coordinator unblocked",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating Coordinator status" });
  }
};
