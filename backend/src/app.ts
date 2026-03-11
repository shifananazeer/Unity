import express from "express";
import authRoutes from "./routes/user/authRoutes";
import paymentRoutes from "./routes/user/paymentRoutes";
import userRoutes from "./routes/user/userRoutes";
import superAuthRoutes from "./routes/superadmin/authRoutes";
import dashboardRoutes from "./routes/superadmin/dashboardRoutes";
import adminAuthRoutes from "./routes/admin/adminRoutes";
import cors from "cors";

const app = express();  

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

//user routes
app.use("/api/auth", authRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/user" , userRoutes)

//superadminroutes

app.use("/api/superadmin", superAuthRoutes);

app.use("/api/superadmin", dashboardRoutes);

//admin routes

 app.use("/api/admin", adminAuthRoutes);



export default app;