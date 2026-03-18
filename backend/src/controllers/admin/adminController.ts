import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import SecondAdmin from "../../models/admin";
import generateToken from "../../utils/generateToken";
import { AuthRequest } from "../../middleware/authMiddleware";
import User ,{IUser} from "../../models/User"
import Coordinator from "../../models/coordinator";
import Payment ,{IPayment} from "../../models/Payment";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

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

    console.log("adminId:", adminId);

    // 1️⃣ Total users under this admin
    const totalUsers = await User.countDocuments({ admin: adminId });

    // 2️⃣ Total coordinators under this admin
    const totalCoordinators = await Coordinator.countDocuments({ admin: adminId });

    // 3️⃣ Payments stats
    // Get all user IDs under this admin
    const users = await User.find({ admin: adminId }).select("_id");
    const userIds = users.map((u) => u._id);

    // Count payments by status
    const payments = await Payment.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Initialize counts
    let totalPayments = 0;
    let paidCount = 0;
    let submittedCount = 0;
    let failedCount = 0;

    payments.forEach((p) => {
      totalPayments += p.count;
      if (p._id === "paid") paidCount = p.count;
      else if (p._id === "submitted") submittedCount = p.count;
      else failedCount += p.count; // all other statuses
    });

    res.json({
      totalUsers,
      totalCoordinators,
      totalPayments,
      paidPayments: paidCount,
      submittedPayments: submittedCount,
      failedPayments: failedCount,
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
        { email: { $regex: search, $options: "i" } },
      ],
    };

    // Get users with coordinator populated
    const users = await User.find(searchFilter)
      .populate("coordinator", "fullName type") // <--- populate coordinator
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(searchFilter);

    res.json({
      users,
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
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
    const { fullName, mobileNumber, email, password, district, type, pin, area } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Incoming district:", district);

    const admin = await SecondAdmin.findOne({
      district: { $regex: new RegExp(`^${district}$`, "i") },
    });

    console.log("Found admin:", admin);

    if (!admin) {
      return res.status(404).json({
        message: "No admin found for this district",
      });
    }

    const coordinator = new Coordinator({
      fullName,
      mobileNumber,
      email,
      password: hashedPassword,
      district,
      type,
      pin,
      area,
      admin: admin._id,
    });
console.log("coo.........................." , coordinator)
    await coordinator.save();

    res.status(201).json({
      success: true,
      message: "Coordinator created successfully",
      coordinator,
    });
  } catch (error: any) {
    console.error("CREATE COORDINATOR ERROR:", error);
    res.status(500).json({ message: error.message });
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
    coordinator.mobileNumber = phone || coordinator.mobileNumber;
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

export const getAdminDistrictPayments = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;

    const admin = await SecondAdmin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const district = admin.district;
    console.log("Admin district:", district);

    // Get all users in this district
    const users = await User.find({ district }).select("_id");
    console.log("Users found:", users);

    const userIds = users.map((u) => u._id);
    console.log("User IDs:", userIds);

    // Fetch payments for these users and populate user info + coordinator info
    const payments = await Payment.find({
      userId: { $in: userIds },
    }).populate({
      path: "userId",
      select: "fullName mobileNumber district coordinator",
      populate: {
        path: "coordinator",
        select: "fullName mobileNumber type", // you can select other fields if needed
      },
    });

    console.log("Payments found:", payments);

    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

export const updateAdminUpi = async (req: AuthRequest, res: Response) => {
  try {
 
     const adminId = req.user?.id;
 
     console.log("Admin ID:", adminId);
 
     const { upiId } = req.body;
 
     const admin = await SecondAdmin.findByIdAndUpdate(
       adminId,
       { upiId },
       { returnDocument: "after" }
     );
 
     res.json({
       message: "UPI updated successfully",
       admin
     });
 
   } catch (error) {
     res.status(500).json({ message: "Error updating UPI" });
   }
};

export const getUpi = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;

    const admin = await SecondAdmin.findById(adminId).select("upiId");

    res.json({
      upiId: admin?.upiId || ""
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching UPI" });
  }
};

export const getCoordinatorsByAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id; // Admin ID from JWT

    // Find coordinators where admin field matches this admin
    const coordinators = await Coordinator.find({ admin: adminId }).select(
      "_id fullName type"
    );
 console.log("coo details..................................................." , coordinators)
    res.status(200).json(coordinators);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching coordinators" });
  }
};

dayjs.extend(isSameOrAfter);

interface MissedPaymentUser {
  _id: string;
  fullName: string;
  mobileNumber: string;
  coordinator?: {
    _id?: string;
    fullName: string;
    type?: string;
  };
  admin?: {
    _id?: string;
    fullName: string;
  };
  missedMonths: number;
}

export const getAdminMissedPayments = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.id;
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ 1️⃣ Get all users under this admin
    const users: IUser[] = await User.find({ admin: adminId })
      .populate("coordinator", "fullName type")
      .populate("admin", "fullName")
      .select("_id fullName mobileNumber coordinator admin");

    // ✅ 2️⃣ Get all payments for these users
    const userIds = users.map((u) => u._id);
    const payments: IPayment[] = await Payment.find({
      userId: { $in: userIds },
    }).select("userId month status");

    // ✅ 3️⃣ Map payments by user
    const paymentsMap = new Map<string, IPayment[]>();
    payments.forEach((p) => {
      const key = p.userId.toString();
      if (!paymentsMap.has(key)) paymentsMap.set(key, []);
      paymentsMap.get(key)!.push(p);
    });

    // ✅ 4️⃣ Calculate consecutive missed months
    const result: MissedPaymentUser[] = users
      .map((user) => {
        const userPayments = paymentsMap.get(user._id.toString()) || [];

        const firstPaymentMonth = userPayments.length
          ? dayjs(
              userPayments.reduce(
                (min, p) => (p.month < min ? p.month : min),
                userPayments[0].month
              ) + "-01"
            )
          : null;

        let consecutiveMissed = 0;

        if (firstPaymentMonth) {
          let monthCursor = dayjs();

          while (monthCursor.isSameOrAfter(firstPaymentMonth, "month")) {
            const monthStr = monthCursor.format("YYYY-MM");

            const paid = userPayments.find(
              (p) => p.month === monthStr && p.status === "paid"
            );

            if (!paid) {
              consecutiveMissed++;
            } else {
              break;
            }

            monthCursor = monthCursor.subtract(1, "month");
          }
        } else {
          consecutiveMissed = 0;
        }

        return {
          _id: user._id.toString(),
          fullName: user.fullName,
          mobileNumber: user.mobileNumber,
          coordinator: user.coordinator
            ? {
                _id: (user.coordinator as any)._id?.toString(),
                fullName: (user.coordinator as any).fullName || "N/A",
                type: (user.coordinator as any).type,
              }
            : undefined,
          admin: user.admin
            ? {
                _id: (user.admin as any)._id?.toString(),
                fullName: (user.admin as any).fullName || "N/A",
              }
            : undefined,
          missedMonths: consecutiveMissed,
        };
      })
      .filter((u) => u.missedMonths >= 1);

    console.log("Admin Missed Payments:", result);

    res.status(200).json({ users: result });
  } catch (error) {
    console.error("Error fetching admin missed payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ message: "Server error" });
  }
};