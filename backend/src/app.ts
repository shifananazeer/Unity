import express from "express";
import authRoutes from "./routes/user/authRoutes";
import paymentRoutes from "./routes/user/paymentRoutes";
import userRoutes from "./routes/user/userRoutes";
import cors from "cors";

const app = express();  

// Middleware
app.use(express.json());
app.use(cors());

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// auth Routes
app.use("/api/auth", authRoutes);

// payment routes
app.use("/api/payment", paymentRoutes);

app.use("/api/user" , userRoutes)

export default app;