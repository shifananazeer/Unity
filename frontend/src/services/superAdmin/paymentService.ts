import api from "../api";


export const getPayments = async () => {
  try {
    const token = localStorage.getItem("token")
    const res = await api.get("/superadmin/payments",
      {headers:{
        Authorization:`Bearer ${token}`
      }},
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

export const getUpiDetails = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/payment/upi-details", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};