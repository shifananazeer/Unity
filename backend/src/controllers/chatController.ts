// controllers/chatController.ts
import Message from "../models/Message";

export const sendMessage = async (req: any, res: any) => {
  try {
    const sender = req.user.id; // logged-in user/coordinator/admin
    const senderRole = req.user.role; // "user" | "coordinator" | "admin"
    const { receiverId, receiverRole, text } = req.body;

    if (!receiverId || !receiverRole || !text) {
      return res.status(400).json({ message: "receiverId, receiverRole, and text are required" });
    }

    const message = await Message.create({
      sender,
      senderRole,
      receiver: receiverId,
      receiverRole,
      text,
    });

    // Emit message to receiver via socket
    const io = require("../socket").getIO();
    io.to(receiverId).emit("receiveMessage", {
      _id: message._id.toString(),
      sender,
      senderRole,
      receiver: receiverId,
      receiverRole,
      text: message.text,
      createdAt: message.createdAt,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(
      messages.map((m) => ({
        _id: m._id.toString(),
        sender: m.sender.toString(),
        senderRole: m.senderRole,
        receiver: m.receiver.toString(),
        receiverRole: m.receiverRole,
        text: m.text,
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};