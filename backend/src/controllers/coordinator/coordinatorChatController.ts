import Message from "../../models/Message";
import { getIO } from "../../socket";

export const sendMessageCoordinator = async (req: any, res: any) => {
  try {
    const sender = req.user.id; // coordinator id
    const { receiverId, text } = req.body;

    if (!receiverId || !text) return res.status(400).json({ message: "receiverId and text required" });

    const message = await Message.create({
      sender,
      receiver: receiverId,
      text,
      senderRole: "coordinator",
      receiverRole: "user", // coordinator always talks to users
    });

    // Emit via socket
    const io = getIO();
    io.to(receiverId).emit("receiveMessage", {
      _id: message._id.toString(),
      sender,
      senderRole: "coordinator",
      receiver: receiverId,
      receiverRole: "user",
      text,
      createdAt: message.createdAt,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Coordinator send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages between coordinator and a user
export const getMessagesCoordinator = async (req: any, res: any) => {
  try {
    const coordId = req.user.id;
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: coordId, receiver: receiverId },
        { sender: receiverId, receiver: coordId },
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
    console.error("Coordinator get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};