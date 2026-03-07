import express from "express";
const router = express.Router();
import { adminLogin } from "../../controllers/admin/authControllers";
import { getDashboardStats } from "../../controllers/admin/dashboardController";


router.post ("/login", adminLogin);


    

export default router;