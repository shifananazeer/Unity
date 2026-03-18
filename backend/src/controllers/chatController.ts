// controllers/chatController.ts
import Message from "../models/Message";

export const sendMessage = async (req: any, res: any) => {
  try {
    const sender = req.user.id; // from auth middleware
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "receiverId and text are required" });
    }

    const message = await Message.create({
      sender,
      receiver: receiverId,
      text,
    });

    // emit to receiver via socket
    const io = require("../socket").getIO(); // get initialized socket
    io.to(receiverId).emit("receiveMessage", {
      _id: message._id.toString(),
      sender,
      receiver: receiverId,
      text,
      createdAt: message.createdAt,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all messages between logged-in user and receiver
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
        receiver: m.receiver.toString(),
        text: m.text,
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};