import api from "./api";

interface SendMessageParams {
  receiverId: string;
  text: string;
   receiverRole: "user" | "coordinator" | "admin";
}

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  receiverRole:string;
  senderRole:string;
  text: string;
  createdAt: string;
}

// Send a message to backend (DB)
export const sendMessage = async ({ receiverId,receiverRole, text }: SendMessageParams) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post(
      "/chat/send",
      { receiverId, receiverRole ,text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to send chat message", err);
    throw err;
  }
};

// Get previous messages between logged-in user and receiver
export const getMessages = async (receiverId: string): Promise<Message[]> => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(`/chat/${receiverId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch chat messages", err);
    throw err;
  }
};