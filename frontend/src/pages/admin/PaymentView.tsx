import { useEffect, useState } from "react";
import PaymentsTable from "../../components/PaymentsTable";
import { getPaymentsBasedOnDistrict , getCoordinatorsByAdmin } from "../../services/admin/adminService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Payment {
  _id: string;
  amount: number;
  month: string;
  status: string;
  userId: {
    _id: string;
    fullName: string;
    mobileNumber: string;
    district: string;
    coordinator?: {
      _id: string;
      fullName: string;
      type: string;
    };
  };
}

interface Coordinator {
  _id: string;
  fullName: string;
  type: string;
}

const PaymentsView = () => {

   const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetchPayments();
     fetchCoordinators();
  }, []);

    const fetchPayments = async () => {
    try {
      const data = await getPaymentsBasedOnDistrict(); // Backend endpoint uses admin ID from token
      setPayments(Array.isArray(data.payments) ? data.payments : []);
      setFilteredPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
      setFilteredPayments([]);
    }
  };

   useEffect(() => {
    applyFilters();
  }, [selectedCoordinator, selectedMonth, payments]);

  const applyFilters = () => {
    let filtered = [...payments];

    if (selectedCoordinator) {
      filtered = filtered.filter(
        (p) => p.userId.coordinator?._id === selectedCoordinator
      );
    }

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
      District: p.userId.district || "-",
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


  const fetchCoordinators = async () => {
    try {
      const data = await getCoordinatorsByAdmin(); // Backend uses admin ID from token
      setCoordinators(data);
    } catch (err) {
      console.error("Error fetching coordinators:", err);
      setCoordinators([]);
    }
  };

    return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Payments Dashboard</h2>

      <div className="mb-4 text-lg font-medium">
        Total Amount: <span className="text-green-600">₹{totalAmount}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedCoordinator}
          onChange={(e) => setSelectedCoordinator(e.target.value)}
          className="border rounded px-3 py-2"
          disabled={coordinators.length === 0}
        >
          <option value="">All Coordinators</option>
          {coordinators.map((coord) => (
            <option key={coord._id} value={coord._id}>
              {coord.fullName} - {coord.type}
            </option>
          ))}
        </select>

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

      {/* Payments Table */}
      <PaymentsTable payments={filteredPayments} showAdminColumn={false}  showCoordinatorColumn={true}/>
    </div>
  );
};

export default PaymentsView;