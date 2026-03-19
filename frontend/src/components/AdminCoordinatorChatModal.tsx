"use client";

import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import type { Message } from "../services/chatService";

// Role-based service imports
import {
  getAdminMessages,
  sendAdminMessage,
} from "../services/admin/adminChatService";
import {
  getCoordinatorMessages,
  sendCoordinatorMessage,
} from "../services/coordinator/coordinatorChatService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // logged-in coordinator/admin
  userRole: "coordinator" | "admin" |"superadmin";
  receiverId: string;
  receiverRole: "user" | "coordinator" | "admin";
  receiverName: string;
}

const AdminCoordinatorChatModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userId,
  userRole,
  receiverId,
  receiverRole,
  receiverName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages & join socket room
  useEffect(() => {
    if (!isOpen) return;

    // Join Socket.io room
    socket.emit("join", userId);

    // Fetch previous messages based on role
    const fetchMessagesForRole = async () => {
      try {
        if (userRole === "admin") {
          const msgs = await getAdminMessages(receiverId);
          setMessages(msgs);
        } else if (userRole === "coordinator") {
          const msgs = await getCoordinatorMessages(receiverId);
          setMessages(msgs);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
        setMessages([]);
      }
    };

    fetchMessagesForRole();

    // Listen for incoming messages
    const handleReceive = (msg: Message) => {
      if (
        msg.sender.toString() === receiverId.toString() ||
        msg.sender.toString() === userId.toString()
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.emit("leaveRoom", userId);
    };
  }, [isOpen, receiverId, userId, userRole]);

  // Send a message
  const handleSend = async () => {
    if (!text.trim()) return;

    const msg: Message = {
      _id: Date.now().toString(),
      sender: userId,
      senderRole: userRole,
      receiver: receiverId,
      receiverRole,
      text,
      createdAt: new Date().toISOString(),
    };
   console.log("sender" ,userId)
    // Emit via Socket.io
    socket.emit("sendMessage", msg);

    // Persist in backend based on role
    try {
      if (userRole === "admin") {
        await sendAdminMessage({ receiverId, receiverRole:"user", text });
      } else if (userRole === "coordinator") {
        await sendCoordinatorMessage({ receiverId, receiverRole: "user", text });
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }

    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="font-semibold">{receiverName}</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="p-3 h-64 overflow-y-auto flex flex-col gap-2">
         <div className="p-3 h-64 overflow-y-auto flex flex-col gap-2">
  {messages.map((msg) => {
    const isOwnMessage = msg.sender.toString() === userId.toString();
    return (
      <div
        key={msg._id}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`p-2 rounded text-sm max-w-[70%] break-words ${
            isOwnMessage
              ? "bg-blue-500 text-white self-end"   // your messages: right side
                    : "bg-gray-200 text-black self-start"
          }`}
        >
          {msg.text}
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef} />
</div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCoordinatorChatModal;