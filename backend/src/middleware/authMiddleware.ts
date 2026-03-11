import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import SecondAdmin from "../models/admin";
import SuperAdmin from "../models/superadmin";
import User from "../models/User";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
  role?: "superadmin" | "admin" | "user";
}

const authMiddleware = (roles: Array<"superadmin" | "admin" | "user">) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      req.user = decoded;

      // Role verification
      let valid = false;

      if (roles.includes("superadmin")) {
        const superAdmin = await SuperAdmin.findById(decoded.id);
        if (superAdmin) valid = true;
      }

      if (roles.includes("admin")) {
        const admin = await SecondAdmin.findById(decoded.id);
        if (admin) valid = true;
      }

      if (roles.includes("user")) {
        const user = await User.findById(decoded.id);
        if (user) valid = true;
      }

      if (!valid) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default authMiddleware;