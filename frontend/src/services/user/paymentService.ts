import api from "./../api";


export const createPayment = async (amount: number) => {
  const token = localStorage.getItem("token");
  console.log("Creating payment with amount:", amount);
  try {
    const res = await api.post("/payment/create-qr", { amount }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Payment created:", res.data);
    return res.data;
  }
  catch (error) {
    console.error("Payment initiation failed:", error);
    throw error;
  } 
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