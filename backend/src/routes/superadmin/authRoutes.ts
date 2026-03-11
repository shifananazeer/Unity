import express from "express";
const router = express.Router();
import { adminLogin } from "../../controllers/superadmin/authControllers";
import { getDashboardStats } from "../../controllers/superadmin/dashboardController";


router.post ("/login", adminLogin);


    

export default router;