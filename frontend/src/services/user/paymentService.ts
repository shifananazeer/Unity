interface PaymentOrder {
  orderId: string;
  amount: number;
  month: string;  
   qrImage?: string;
}

export const initiatePayment = async (): Promise<PaymentOrder> => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/create-qr`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data: PaymentOrder = await res.json();
    return data;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error;
  }
};