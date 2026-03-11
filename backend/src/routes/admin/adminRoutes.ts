import express from "express";
import authMiddleware from "../../middleware/authMiddleware";
import {adminLogin,
    getAdminDashboardStats ,
    getUserBasedOnDistrict ,
    blockUser  ,
    createCoordinator ,
    getCoordinators , 
    updateCoordinator ,
    toggleCoordinatorBlock
    } from "../../controllers/admin/adminController";

const router = express.Router();

router.post("/login" , adminLogin)

router.get("/dashboard-stats",authMiddleware(["admin"]), getAdminDashboardStats);

router.get("/users" ,authMiddleware(["admin"]) , getUserBasedOnDistrict);

router.patch("/toggle-user-block/:id" , authMiddleware (["admin"]) , blockUser)

router.post("/create-coordinator",authMiddleware(["admin"]), createCoordinator);

router.get("/get-coordinators",authMiddleware(["admin"]),getCoordinators)

router.put("/update-coordinator/:id" , authMiddleware(["admin"]) , updateCoordinator)

router.patch("/coordinators/block/:id",authMiddleware(["admin"]), toggleCoordinatorBlock);

export default router;


