import { Request , Response } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken";



export const signup = async (req: Request, res: Response) => {
    try{
        const { fullName, mobileNumber, pinCode, district, state, localBody, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ mobileNumber });
        if(existingUser){
            return res.status(400).json({ message: "User with this mobile number already exists" });
        }
        const  hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            mobileNumber,
            pinCode,
            district,
            state,
            localBody,
            password: hashedPassword
        });
        await newUser.save();
        const token = generateToken(newUser._id.toString());
        res.status(201).json({ message: "User created successfully" , user:newUser, token });
    
    }catch(error){
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
        const token = generateToken(user._id.toString());
        res.status(200).json({ message: "Login successful", user, token });
    }catch(error){
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

