import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*", // ⚠️ later restrict to frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);

    // ✅ join room (VERY IMPORTANT)
    socket.on("join", (userId: string) => {
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

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};