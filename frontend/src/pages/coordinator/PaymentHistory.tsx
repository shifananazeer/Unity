import { useEffect, useState } from "react";
import PaymentsTable from "../../components/PaymentsTable";
import { getPayments } from "../../services/coordinator/CoordinatorService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Payment {
  _id: string;
  amount: number;
  month: string;
  status: string;
  screenshot?: string;
  userId: {
    fullName: string;
    mobileNumber: string;
    coordinator?: { fullName: string; type: string };
  };
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedMonth, payments]);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      console.log("Fetched payments:", data);
      setPayments(data.payments || []);
      setFilteredPayments(data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
      setFilteredPayments([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];

    if (selectedMonth) {
      filtered = filtered.filter((p) => p.month.startsWith(selectedMonth));
    }

    setFilteredPayments(filtered);
  };

  const totalAmount = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  const exportToExcel = () => {
    const data = filteredPayments.map((p) => ({
      User: p.userId.fullName,
      Phone: p.userId.mobileNumber,
      Coordinator: p.userId.coordinator
        ? `${p.userId.coordinator.fullName} - ${p.userId.coordinator.type}`
        : "-",
      Amount: p.amount,
      Month: p.month,
      Status: p.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Payments.xlsx");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Payments</h2>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={exportToExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export to Excel
        </button>
      </div>

      {/* Total Amount */}
      <div className="mb-4 text-lg font-medium">
        Total Amount: <span className="text-green-600">₹{totalAmount}</span>
      </div>

      {/* Payments Table */}
      <PaymentsTable payments={filteredPayments} showAdminColumn={false} showCoordinatorColumn={false} />
    </div>
  );
};

export default PaymentHistory;