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

      req.user = decoded;

      console.log("Decoded:", decoded);

      // ✅ 1. Check role from token FIRST
      if (!decoded.role || !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      let userExists = false;

      // ✅ 2. Verify user exists in correct collection
      if (decoded.role === "superadmin") {
        userExists = !!(await SuperAdmin.findById(decoded.id));
      }

      if (decoded.role === "admin") {
        userExists = !!(await SecondAdmin.findById(decoded.id));
      }

      if (decoded.role === "user") {
        userExists = !!(await User.findById(decoded.id));
      }

      if (decoded.role === "coordinator") {
        userExists = !!(await Coordinator.findById(decoded.id));
      }

      if (!userExists) {
        return res.status(403).json({ message: "User not found" });
      }
      console.log("Decoded:", decoded);
      req.role = decoded.role;

      next();

    } catch (error: any) {
      console.error("Auth error:", error);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }

      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default authMiddleware;