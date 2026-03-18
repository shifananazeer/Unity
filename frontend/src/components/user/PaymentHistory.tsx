"use client";

import React, { useEffect, useState } from "react";
import { getUserPayments } from "../../services/user/profileService";
import { useTranslation } from "react-i18next";

interface Payment {
  _id: string;
  amount: number;
  month: string;
  createdAt: string;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getUserPayments();
        setPayments(data.payments);
        setTotalAmount(data.totalAmount);
      } catch (error) {
        console.error("Error fetching payments", error);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("paymentHistory.title")}
      </h2>

      {/* Total Donation */}
      <div className="mb-4 bg-green-50 p-3 rounded-lg">
        <p className="text-green-700 font-semibold">
          {t("paymentHistory.totalDonated")} ₹{totalAmount}
        </p>
      </div>

      {payments.length === 0 ? (
        <p className="text-gray-500">{t("paymentHistory.noPayments")}</p>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
            >
              <span className="text-gray-600">
                {new Date(payment.month).toLocaleDateString(i18n.language, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <span className="font-semibold text-green-600">
                ₹{payment.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;