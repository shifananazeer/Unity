import { Request, Response } from "express";
import CommunityJoin from "../../models/CommunityJoin";
import { AuthRequest } from "../../middleware/authMiddleware"
import User from "../../models/User";
import Coordinator from "../../models/coordinator";
import SecondAdmin from "../../models/admin";
import RDCommunity from "../../models/RDCommunity";

export const joinCommunity = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.user?.id;
    const { packageName } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await CommunityJoin.findOne({ userId });

    if (existing) {
      return res.json({ message: "Already joined community" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const join = new CommunityJoin({
      userId,
      coordinator: user.coordinator,
     
      packageName, 
      status: "joined",
    });

    await join.save();

    res.json({
      message: `Successfully joined ${packageName} community`,
      join,
    });

  } catch (error) {
    console.error("Join community error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCommunityStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const joined = await CommunityJoin.findOne({ userId });

    res.json({
      joined: !!joined,
      packageName: joined?.packageName || null
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getUpiDetails = async (req: Request, res: Response) => {
  try {

    const admin = await SecondAdmin.findOne().select("upiId");

    const coordinator = await Coordinator.findOne().select("upiId");

    res.json({
      adminUpi: admin?.upiId || "",
      coordinatorUpi: coordinator?.upiId || ""
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching UPI details" });
  }
};

export const joinRDCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { packageName } = req.body;

    const existing = await RDCommunity.findOne({ user: userId });

    if (existing) {
      return res.status(400).json({ message: "Already joined RD community" });
    }

    const newEntry = new RDCommunity({
      user: userId,
      packageName,
    });

    await newEntry.save();

    res.json({ message: "Joined RD community successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRDStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const existing = await RDCommunity.findOne({ user: userId });

    res.json({
      joined: !!existing,
      packageName: existing?.packageName || null,
    });

  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

