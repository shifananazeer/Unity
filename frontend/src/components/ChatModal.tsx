"use client";

import React, { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "../services/chatService";
import { socket } from "../socket";
import type { Message } from "../services/chatService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  receiverId: string;
  receiverName: string;
}

const ChatModal: React.FC<Props> = ({ isOpen, onClose, userId, receiverId, receiverName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch initial messages & join socket room
  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      try {
        const msgs = await getMessages(receiverId);
        setMessages(msgs);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    };

    fetchMessages();

    // Join socket room for this chat
    socket.emit("join", userId);

    // Listen for incoming messages
    socket.on("receiveMessage", (msg: Message) => {
      // Only add if it's from this conversation
      if (msg.sender === receiverId || msg.sender === userId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.emit("leaveRoom", userId);
      socket.off("receiveMessage");
    };
  }, [isOpen, receiverId, userId]);

  // Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    const msg: Message = {
      _id: Date.now().toString(),
      sender: userId,
      receiver: receiverId,
      text,
      createdAt: new Date().toISOString(),
    };

    // Emit to socket for real-time
    socket.emit("sendMessage", msg);

    // Persist in DB
    try {
      await sendMessage({ receiverId, text });
    } catch (err) {
      console.error("Failed to save message", err);
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
          <button onClick={onClose} className="text-red-500 font-bold text-lg">✕</button>
        </div>

        {/* Messages */}
        <div className="p-3 h-64 overflow-y-auto flex flex-col gap-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded text-sm max-w-[70%] break-words ${
                msg.sender === userId ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
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

export default ChatModal;