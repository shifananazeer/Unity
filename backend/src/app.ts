import express from "express";
import authRoutes from "./routes/user/authRoutes";
import cors from "cors";

const app = express();  

// Middleware
app.use(express.json());
app.use(cors());

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Routes
app.use("/api/auth", authRoutes);

export default app;