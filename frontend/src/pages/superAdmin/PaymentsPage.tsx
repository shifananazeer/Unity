import { useEffect, useState } from "react";
import PaymentsTable from "../../components/admin/PaymentsTable";
import { getPayments } from "../../services/superAdmin/paymentService";

const PaymentsPage = () => {

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const data = await getPayments();
    console.log("Fetched payments:", data);
    setPayments(data);
  };

  return (
    <div>

      <h2 className="text-xl font-semibold mb-4">
        Payments
      </h2>

      <PaymentsTable payments={payments} />

    </div>
  );
};

export default PaymentsPage;