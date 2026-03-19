import { Request , Response } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken";
import Coordinator from "../../models/coordinator";
import SecondAdmin from "../../models/admin"
import { getNextUserCode } from "../../utils/generateUserCode";
import { generateReferralCode } from "../../utils/generateReferralCode";


export const signup = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      mobileNumber,
      pinCode,
      district,
      state,
      localBody,
      password,
      type,
      referralCode,
    } = req.body;

    if (!fullName || !mobileNumber || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let coordinatorId = null;

    // ✅ Assign coordinator
    if (type === "nano") {
      const nanoCoordinator = await Coordinator.findOne({
        type: "nano",
        pin: pinCode,
      });
      coordinatorId = nanoCoordinator?._id;
    }

    if (type === "micro") {
      const microCoordinator = await Coordinator.findOne({
        type: "micro",
        area: localBody,
      });
      coordinatorId = microCoordinator?._id;
    }

    // ✅ Find admin
    const admin = await SecondAdmin.findOne({ district });

    // ✅ Generate referral code (UNIQUE)
    const newReferralCode = await generateReferralCode();

    // ✅ Generate user code
    const userCode = await getNextUserCode();

    const newUser = new User({
      fullName,
      mobileNumber,
      pinCode,
      district,
      state,
      localBody,
      password: hashedPassword,
      type,
      coordinator: coordinatorId,
      admin: admin?._id,
      userCode,
      referralCode: newReferralCode,
    });

    await newUser.save();

    // ✅ HANDLE REFERRAL (BEFORE RESPONSE)
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }

      // ✅ Prevent self-referral (extra safety)
      if (referrer._id.toString() !== newUser._id.toString()) {
        referrer.referredUsers.push(newUser._id);
        await referrer.save();
      }
    }

    const token = generateToken(newUser._id.toString(), "user");

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req: Request, res: Response) => {
    try{
        const { mobileNumber, password } = req.body;

        // Find the user by mobile number
        const user = await User.findOne({ mobileNumber });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id.toString() , "user");
        res.status(200).json({ message: "Login successful", user, token });
    }catch(error){
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

