import express from "express";
import { getAllUsers, getDashboardStats, toggleUserBlock } from "../../controllers/admin/dashboardController";

const router = express.Router();

router.get("/dashboard/stats", getDashboardStats);

router.get("/users", getAllUsers);

router.patch("/users/block/:id", toggleUserBlock);

export default router;