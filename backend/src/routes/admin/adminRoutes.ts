import express from "express";
import authMiddleware from "../../middleware/authMiddleware";
import {adminLogin,
    getAdminDashboardStats ,
    getUserBasedOnDistrict ,
    blockUser  ,
    createCoordinator ,
    getCoordinators , 
    updateCoordinator ,
    toggleCoordinatorBlock,
    getAdminDistrictPayments,
    updateAdminUpi,
    getUpi,
    getCoordinatorsByAdmin,
    getAdminMissedPayments,
     removeUser,
     adminProfile,
     changeAdminPassword
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

router.get("/payments" , authMiddleware(["admin"]), getAdminDistrictPayments)

router.put("/admin-upi",authMiddleware(["admin"]), updateAdminUpi);

router.get("/admin-upi" ,authMiddleware(["admin"]) , getUpi)

router.get("/coordinators", authMiddleware(["admin"]) , getCoordinatorsByAdmin);

router.get("/missed-payments",authMiddleware(["admin"]), getAdminMissedPayments);

router.delete("/remove-user/:userId",authMiddleware(["admin"]) , removeUser);

router.get("/profile" , authMiddleware(["admin"]), adminProfile)

router.put( "/change-password",authMiddleware(["admin"]),changeAdminPassword);
export default router;


