import Message from "../../models/Message";
import { getIO } from "../../socket";

// Send message from admin to any receiver
export const sendMessageAdmin = async (req: any, res: any) => {
  try {
    const sender = req.user.id; // admin id
    const { receiverId, text } = req.body;

    if (!receiverId || !text) return res.status(400).json({ message: "receiverId and text required" });

    const message = await Message.create({
      sender,
      receiver: receiverId,
      text,
      senderRole: "admin",
      receiverRole: "user", // admin always talks to users
    });

    // Emit via socket
    const io = getIO();
    io.to(receiverId).emit("receiveMessage", {
      _id: message._id.toString(),
      sender,
      senderRole: "admin",
      receiver: receiverId,
      receiverRole: "user",
      text,
      createdAt: message.createdAt,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Admin send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages between admin and a user
export const getMessagesAdmin = async (req: any, res: any) => {
  try {
    const adminId = req.user.id;
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: adminId, receiver: receiverId },
        { sender: receiverId, receiver: adminId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages.map(m => ({
      _id: m._id.toString(),
      sender: m.sender.toString(),
      senderRole: m.senderRole,
      receiver: m.receiver.toString(),
      receiverRole: m.receiverRole,
      text: m.text,
      createdAt: m.createdAt,
    })));
  } catch (err) {
    console.error("Admin get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};