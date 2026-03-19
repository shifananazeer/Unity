import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Coordinator from "../../models/coordinator";
import generateToken from "../../utils/generateToken";
import { AuthRequest } from "../../middleware/authMiddleware";
import User , {IUser}from "../../models/User";
import Payment ,{ IPayment } from "../../models/Payment";
import DirectSellingCommunityJoin from "../../models/CommunityJoin"
// @ts-ignore
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import Message from "../../models/Message";
import RDCommunity from "../../models/RDCommunity";




export const coordinatorLogin = async (req: Request, res: Response) => {
  console.log("Coordinator login")
    const { email, password } = req.body;
    console.log("Email from request:", email);
    try {
        // Find admin by email
        const coordinator = await Coordinator.findOne({ email });
        if (!coordinator) {
            return res.status(404).json({ message: "Coordinator not found" });
        }   
        // Check if password matches
        const isMatch = await bcrypt.compare(password, coordinator.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = generateToken(coordinator._id.toString(), "coordinator");
        res.status(200).json({ message: "Login successful", coordinator, token });
    } catch (error) {
        console.error("coordinator login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};


export const getCoordinatorDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const coordinatorId = req.user?.id;

    if (!coordinatorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1️⃣ Total users under this coordinator
    const users = await User.find({ coordinator: coordinatorId }).select("_id");
    const userIds = users.map((u) => u._id);
    const totalUsers = users.length;

    // 2️⃣ Payment stats (ONLY paid & pending)
   const paymentStats = await Payment.aggregate([
  {
    $match: {
      userId: { $in: userIds },
      status: { $in: ["paid", "pending", "submitted"] }, // include submitted
    },
  },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
    },
  },
]);

let paidPayments = 0;
let submittedPayments = 0;
let failedPayments = 0;

paymentStats.forEach((p) => {
  if (p._id === "paid") {
    paidPayments = p.count;
  } else if (p._id === "submitted") {
    submittedPayments = p.count;
  } else if (p._id === "pending") {
    failedPayments = p.count;
  }
});

// totalPayments = paid + submitted
const totalPayments = paidPayments + submittedPayments;
    // 3️⃣ Direct Selling Community count
    const directSellingCount = await DirectSellingCommunityJoin.countDocuments({
      userId: { $in: userIds },
    });

    // 4️⃣ RD Community count
    const rdCommunityCount = await RDCommunity.countDocuments({
      user: { $in: userIds },
    });
console.log("DSC" , directSellingCount)
    // ✅ Final response
    res.json({
      totalUsers,
      totalPayments,
      failedPayments,
      totalDirectSellingUsers: directSellingCount,
      totalRDUsers: rdCommunityCount,
    });

  } catch (error) {
    console.error("Coordinator dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAssignedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const coordinatorId = req.user?.id;

    if (!coordinatorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get coordinator details
    const coordinator = await Coordinator.findById(coordinatorId);

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    // Fetch users assigned to this coordinator
    const users = await User.find({ coordinator: coordinatorId })
      .select("-password")
      .sort({ createdAt: -1 });

    // Send users + coordinator type in response
    res.status(200).json({
      count: users.length,
      users,
      coordinatorType: coordinator.type,
    });

  } catch (error) {
    console.error("Error fetching assigned users:", error);
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

export const getCoordinatorPayments = async (req: AuthRequest, res: Response) => {
  try {
    const coordinatorId = req.user?.id;

    if (!coordinatorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find all users under this coordinator
    const users = await User.find({ coordinator: coordinatorId }).select("_id");
    const userIds = users.map((u) => u._id);

    // Fetch payments of those users
    const payments = await Payment.find({ userId: { $in: userIds } })
      .populate("userId", "fullName mobileNumber coordinator") // include coordinator info
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Coordinator payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const coordinatorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const coordinatorId = req.user?.id;

    if (!coordinatorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await Coordinator.findById(coordinatorId).select("-password");

    if (!profile) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    res.status(200).json(profile);

  } catch (error) {
    console.error("Coordinator profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const changeCoordinatorPassword = async (req: AuthRequest, res: Response) => {
  try {
    const coordinatorId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!coordinatorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const coordinator = await Coordinator.findById(coordinatorId);

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    // check current password
    const isMatch = await bcrypt.compare(currentPassword, coordinator.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    coordinator.password = hashedPassword;

    await coordinator.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCoordinatorUpi = async (req: AuthRequest, res: Response) => {
  try {

    const coordinatorId = req.user?.id;

    console.log("Coordinator ID:", coordinatorId);

    const { upiId } = req.body;

    const coordinator = await Coordinator.findByIdAndUpdate(
      coordinatorId,
      { upiId },
      { returnDocument: "after" }
    );

    res.json({
      message: "UPI updated successfully",
      coordinator
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating UPI" });
  }
};

export const getCoordinatorUpi = async (req: Request, res: Response) => {
  try {
    const coordinatorId = (req as any).user.id;

    const coordinator = await Coordinator.findById(coordinatorId).select("upiId");

    res.json({
      upiId: coordinator?.upiId || ""
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching UPI" });
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
  missedMonths: number; // consecutive missed months
}

export const getMissedPayments = async (req: Request, res: Response) => {
  try {
    const coordinatorId = (req as any).user?.id;
    if (!coordinatorId) return res.status(401).json({ message: "Unauthorized" });

    // 1️⃣ Get all users under this coordinator
    const users: IUser[] = await User.find({ coordinator: coordinatorId }).select(
      "_id fullName mobileNumber coordinator admin"
    );

    // 2️⃣ Get all payments for these users (no month limit)
    const userIds = users.map((u) => u._id);
    const payments: IPayment[] = await Payment.find({
      userId: { $in: userIds },
    }).select("userId month status");

    // 3️⃣ Map payments by user
    const paymentsMap = new Map<string, IPayment[]>();
    payments.forEach((p) => {
      const key = p.userId.toString();
      if (!paymentsMap.has(key)) paymentsMap.set(key, []);
      paymentsMap.get(key)!.push(p);
    });

    // 4️⃣ Calculate consecutive missed months for each user
    const result: MissedPaymentUser[] = users
      .map((user) => {
        const userPayments = paymentsMap.get(user._id.toString()) || [];

        // Find the earliest payment month for this user
        const firstPaymentMonth = userPayments.length
          ? dayjs(
              userPayments.reduce(
                (min, p) => (p.month < min ? p.month : min),
                userPayments[0].month
              ) + "-01"
            )
          : null; // null if no payments

        let consecutiveMissed = 0;

        if (firstPaymentMonth) {
          let monthCursor = dayjs(); // start from current month

          while (monthCursor.isSameOrAfter(firstPaymentMonth, "month")) {
            const monthStr = monthCursor.format("YYYY-MM");
            const paid = userPayments.find(
              (p) => p.month === monthStr && p.status === "paid"
            );
            if (!paid) {
              consecutiveMissed++;
            } else {
              break; // stop counting at the first paid month
            }
            monthCursor = monthCursor.subtract(1, "month");
          }
        } else {
          consecutiveMissed = 0; // no payments yet
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
      .filter((u) => u.missedMonths >= 1); // only include users with 1+ consecutive misses

    console.log("Missed Payments Result:", result);
    res.status(200).json({ users: result });
  } catch (error) {
    console.error("Error fetching missed payments:", error);
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

export const getCoordinatorMessages = async (req:AuthRequest, res:Response) => {
  const coordinatorId = req.user?.id;
  const { userId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: coordinatorId, receiver: userId },
        { sender: userId, receiver: coordinatorId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err });
  }
};

export const sendCoordinatorMessage = async (req:AuthRequest, res:Response) => {
  const sender = req.user?.id;
  const { userId, text } = req.body;

  if (!userId || !text) return res.status(400).json({ message: "Missing fields" });

  try {
    const message = await Message.create({ sender, receiver: userId, text });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err });
  }
};


export const getUserDetails = async (req: any, res: any) => {
  try {
   const { userId } = req.params;
    console.log("📥 Received ID:", userId);
    const user = await User.findById(userId)
      .populate("referredUsers", "fullName mobileNumber")
      .populate("coordinator", "fullName")
      .populate("admin", "fullName");
    console.groupCollapsed("userDetals " , user)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
};
