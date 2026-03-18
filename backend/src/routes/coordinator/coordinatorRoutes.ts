import express from "express";
import authMiddleware from "../../middleware/authMiddleware";
import { 
    coordinatorLogin ,
    getCoordinatorDashboardStats,
     getAssignedUsers ,
     blockUser,
     getCoordinatorPayments,
     coordinatorProfile,
     changeCoordinatorPassword,
     updateCoordinatorUpi,
     getCoordinatorUpi,
     getMissedPayments,
     removeUser
    } from "../../controllers/coordinator/coordinatorController";


const router = express.Router();

router.post("/login", coordinatorLogin);

router.get("/dashboard-stats",authMiddleware(["coordinator"]), getCoordinatorDashboardStats);

router.get("/users" ,authMiddleware(["coordinator"]) , getAssignedUsers);

router.patch("/toggle-user-block/:id" , authMiddleware (["coordinator"]) , blockUser)

router.get("/payments" , authMiddleware(["coordinator"]), getCoordinatorPayments)

router.get("/profile" , authMiddleware(["coordinator"]), coordinatorProfile)

router.put( "/change-password",authMiddleware(["coordinator"]),changeCoordinatorPassword);

router.get("/coordinator-upi",authMiddleware(["coordinator"]), getCoordinatorUpi);

router.put("/coordinator-upi", authMiddleware(["coordinator"]), updateCoordinatorUpi);

router.get("/missed-payments",authMiddleware(["coordinator"]), getMissedPayments);

router.delete("/remove-user/:userId",authMiddleware(["coordinator"]) , removeUser);

export default router;