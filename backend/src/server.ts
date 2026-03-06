import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";
import path from "path";
import express from "express";



// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});