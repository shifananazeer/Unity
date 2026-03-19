import api from "../api";
export interface AdminMessage {
  _id: string;
  sender: string; // coordinator or user
  senderRole: "user" | "admin";
  receiver: string;
  receiverRole: "user" | "admin";
  text: string;
  createdAt: string;
}


export const sendAdminMessage = async ({
  receiverId,
  receiverRole,
  text,
}: {
  receiverId: string;
  receiverRole:  "admin";
  text: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/chat/usertoadmin/send",
    { receiverId, receiverRole, text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Get all messages for a coordinator chat
export const getAdminMessages = async (receiverId: string) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/chat/getUseradmin/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as AdminMessage[];
};


export interface CoordinatorMessage {
  _id: string;
  sender: string; // coordinator or user
  senderRole: "user" | "coordinator";
  receiver: string;
  receiverRole: "user" | "coordinator";
  text: string;
  createdAt: string;
}

// Send a message from coordinator
export const sendCoordinatorMessage = async ({
  receiverId,
  receiverRole,
  text,
}: {
  receiverId: string;
  receiverRole: "user" | "coordinator";
  text: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/chat/send",
    { receiverId, receiverRole, text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Get all messages for a coordinator chat
export const getCoordinatorMessages = async (receiverId: string) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/chat/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as CoordinatorMessage[];
};