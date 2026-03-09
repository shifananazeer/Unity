import express from "express";
import { getAllUsers, getDashboardStats, toggleUserBlock ,createAdmin , getAllAdmins, toggleAdminBlock , getAllPayments , updateAdmin} from "../../controllers/admin/dashboardController";



const router = express.Router();

router.get("/dashboard/stats", getDashboardStats);

router.get("/users", getAllUsers);

router.patch("/users/block/:id", toggleUserBlock);

router.post("/create-admin",createAdmin);

router.get("/admins", getAllAdmins);

router.patch("/block/:id", toggleAdminBlock);

router.get("/payments", getAllPayments)

router.put("/update-admin/:id", updateAdmin);

export default router;