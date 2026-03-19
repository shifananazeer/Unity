import api from "../api";

export interface AdminMessage {
  _id: string;
  sender: string; // admin, coordinator, or user
  senderRole: "user" | "coordinator" | "admin";
  receiver: string;
  receiverRole: "user" | "coordinator" | "admin";
  text: string;
  createdAt: string;
}

// Send a message from admin
export const sendAdminMessage = async ({
  receiverId,
  receiverRole,
  text,
}: {
  receiverId: string;
  receiverRole: "user";
  text: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/chat/admin/send",
    { receiverId, receiverRole, text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Get all messages for admin chat
export const getAdminMessages = async (receiverId: string ) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/chat/admin/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as AdminMessage[];
};