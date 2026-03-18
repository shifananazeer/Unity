import api from "./../api";


export const createPayment = async (data: {
  amount: number;
  paidTo: "coordinator" | "admin";
}) => {
  const token = localStorage.getItem("token");

  const res = await api.post("/payment/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const uploadPaymentScreenshot = async ( file: File ,paymentId: string) => {
  const token = localStorage.getItem("token");
  console.log("Uploading screenshot:", file);
  try {
    const formData = new FormData();
    formData.append("screenshot", file);
    formData.append("paymentId", paymentId);
    const res = await api.post("/payment/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Screenshot uploaded:", res.data);
    return res.data;
  } catch (error) {
    console.error("Screenshot upload failed:", error);
    throw error;
  }
};

export const getUpiDetails = async () => {
   const token = localStorage.getItem("token");
  const res = await api.get("/payment/upi-details" ,{
    headers: {
        Authorization: `Bearer ${token}`, 
       
      },
  });
  return res.data;
};

export const confirmPayment = async (paymentId: string) => {
  const token = localStorage.getItem("token");

  const res = await api.patch(
    "/payment/confirm",
    { paymentId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};