"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // ⚠️ later restrict to frontend URL
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("🔥 User connected:", socket.id);
        // ✅ join room (VERY IMPORTANT)
        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });
        // ✅ send message
        socket.on("sendMessage", (data) => {
            const { receiverId } = data;
            console.log("📩 Message sent:", data);
            // send to receiver room
            io.to(receiverId).emit("receiveMessage", data);
        });
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error("Socket not initialized");
    return io;
};
exports.getIO = getIO;
