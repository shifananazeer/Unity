import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import path from "path";
import express from "express";
import { initSocket } from "./socket";
import http from "http";


const server = http.createServer(app);
// Connect DB
connectDB();

initSocket(server);
// Static folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = process.env.PORT || 5000;

// 🚀 Use server.listen NOT app.listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});