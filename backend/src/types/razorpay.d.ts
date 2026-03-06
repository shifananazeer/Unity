// types/razorpay.d.ts
declare module "razorpay" {
  interface Razorpay {
    qr: {
      create(params: {
        type: "upi_qr" | "dynamic";
        name: string;
        usage: "single_use" | "multiple_use";
        fixed_amount: boolean;
        payment_amount: number;
        description?: string;
        customer?: { name?: string; email?: string };
      }): Promise<any>;
    };
  }
}