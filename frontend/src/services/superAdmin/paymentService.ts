import api from "../api";


export const getPayments = async () => {
  try {
    const res = await api.get("/admin/payments");
    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};