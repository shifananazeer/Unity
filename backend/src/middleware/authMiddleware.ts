import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import SecondAdmin from "../models/admin";
import SuperAdmin from "../models/superadmin";
import User from "../models/User";
import Coordinator from "../models/coordinator";

interface JwtPayload {
  id: string;
  role?: "superadmin" | "admin" | "user" | "coordinator";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
  role?: "superadmin" | "admin" | "user" | "coordinator";
}

const authMiddleware = (
  roles: Array<"superadmin" | "admin" | "user" | "coordinator">
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // attach user info
      req.user = decoded;

      console.log("Decoded user id:", decoded.id);

      let valid = false;

      if (roles.includes("superadmin")) {
        const superAdmin = await SuperAdmin.findById(decoded.id);
        if (superAdmin) {
          req.role = "superadmin";
          valid = true;
        }
      }

      if (roles.includes("admin")) {
        const admin = await SecondAdmin.findById(decoded.id);
        if (admin) {
          req.role = "admin";
          valid = true;
        }
      }

      if (roles.includes("user")) {
        const user = await User.findById(decoded.id);
        if (user) {
          req.role = "user";
          valid = true;
        }
      }

      if (roles.includes("coordinator")) {
        const coordinator = await Coordinator.findById(decoded.id);
        if (coordinator) {
          req.role = "coordinator";
          valid = true;
        }
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