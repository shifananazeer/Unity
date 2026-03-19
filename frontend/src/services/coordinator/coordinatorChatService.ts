import api from "./../api";

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
  receiverRole: "user";
  text: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/chat/coordinator/send",
    { receiverId, receiverRole, text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Get all messages for a coordinator chat
export const getCoordinatorMessages = async (receiverId: string) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/chat/coordinator/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as CoordinatorMessage[];
};