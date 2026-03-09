import { Request , Response } from "express";
import SuperAdmin from "../../models/superadmin";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken";

export const adminLogin = async (req: Request, res: Response) => {
    console.log("Admin auth routes loaded ✅");
  try {
    const { email, password } = req.body;
bcrypt.hash("Admin@123", 10).then(hash => {
  console.log("...................",hash);
});
    console.log("Admin login request received:", { email, password });
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Trim email and query correct collection
    const admin = await SuperAdmin.findOne({ email: email.trim() });
    console.log("Admin found in DB:", admin);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id.toString(), "superadmin");

    const { password: pwd, ...adminData } = admin.toObject();
    res.status(200).json({ message: "Login successful", admin: adminData, token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};