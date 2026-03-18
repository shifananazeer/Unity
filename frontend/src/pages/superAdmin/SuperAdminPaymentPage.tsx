import { useEffect, useState } from "react";
import PaymentsTable from "../../components/PaymentsTable";
import { getPayments } from "../../services/superAdmin/paymentService";
import { getAllAdmins } from "../../services/superAdmin/authService";
import { getCoordinatorById } from "../../services/superAdmin/authService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Admin {
  _id: string;
  fullName: string;
}

interface Coordinator {
  _id: string;
  fullName: string;
  type: string;
}

interface Payment {
  _id: string;
  amount: number;
  month: string;
  status: string;
  screenshot?: string;
  userId: {
    fullName: string;
    mobileNumber: string;
    district?: string;
    admin?: Admin;
    coordinator?: Coordinator;
  };
}

const SuperAdminPaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(Array.isArray(data) ? data : []);
      setFilteredPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
      setFilteredPayments([]);
    }
  };

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchAdmins();
  }, []);

  // Update coordinators whenever selected admin changes
  useEffect(() => {
    const updateCoordinators = async () => {
      if (!selectedAdmin) {
        setCoordinators([]);
        setSelectedCoordinator("");
        applyFilters();
        return;
      }

      // Get all unique coordinator IDs under this admin
      const uniqueCoordinatorIds = Array.from(
        new Set(
          payments
            .filter((p) => p.userId.admin?._id === selectedAdmin)
            .map((p) => p.userId.coordinator?._id)
            .filter(Boolean) as string[]
        )
      );

      // Fetch coordinator details
      const coordinatorDetails: Coordinator[] = [];
      for (const id of uniqueCoordinatorIds) {
        const c = await getCoordinatorById(id);
        if (c) {
          coordinatorDetails.push(c);
        }
      }

      setCoordinators(coordinatorDetails);
      setSelectedCoordinator("");
      applyFilters();
    };

    updateCoordinators();
  }, [selectedAdmin, payments]);

  useEffect(() => {
    applyFilters();
  }, [selectedCoordinator, selectedMonth]);

  const applyFilters = () => {
    let filtered = [...payments];

    if (selectedAdmin) {
      filtered = filtered.filter((p) => p.userId.admin?._id === selectedAdmin);
    }

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

  // Excel Export
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Payments Dashboard</h2>

      {/* Total Amount */}
      <div className="mb-4 text-lg font-medium">
        Total Amount: <span className="text-green-600">₹{totalAmount}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedAdmin}
          onChange={(e) => setSelectedAdmin(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Admins</option>
          {admins.map((admin) => (
            <option key={admin._id} value={admin._id}>
              {admin.fullName}
            </option>
          ))}
        </select>

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
      <PaymentsTable payments={filteredPayments} showAdminColumn={true}  showCoordinatorColumn={true}/>
    </div>
  );
};

export default SuperAdminPaymentPage;