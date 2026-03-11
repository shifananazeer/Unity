import express from "express";
import { getAllUsers, getDashboardStats, toggleUserBlock ,createAdmin , getAllAdmins, toggleAdminBlock , getAllPayments , updateAdmin} from "../../controllers/superadmin/dashboardController";
import authMiddleware from "../../middleware/authMiddleware";



const router = express.Router();

router.get("/dashboard/stats",authMiddleware(["superadmin"]), getDashboardStats);

router.get("/users",authMiddleware(["superadmin"]), getAllUsers);

router.patch("/users/block/:id",authMiddleware(["superadmin"]), toggleUserBlock);

router.post("/create-admin",authMiddleware(["admin"]),createAdmin);

router.get("/admins",authMiddleware(["superadmin"]) , getAllAdmins);

router.patch("/admins/block/:id",authMiddleware(["superadmin"]), toggleAdminBlock);

router.get("/payments",authMiddleware(["superadmin"]) , getAllPayments)

router.put("/update-admin/:id",authMiddleware(["superadmin"]), updateAdmin);

export default router;