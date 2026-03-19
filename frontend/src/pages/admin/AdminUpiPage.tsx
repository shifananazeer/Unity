import React, { useEffect, useState } from "react";
import UpiForm from "../../components/UpiForm";
import { updateAdminUpi, getAdminUpi } from "../../services/admin/adminService";

const AdminUpiPage: React.FC = () => {
  const [upi, setUpi] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpi();
  }, []);

  const fetchUpi = async () => {
    try {
      const data = await getAdminUpi();
      console.log("UPI DATA:", data);

      setUpi(data?.upiId || ""); // ✅ safe access
    } catch (error) {
      console.error("Failed to fetch UPI", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (upiId: string) => {
    try {
      await updateAdminUpi(upiId);
      setUpi(upiId); // ✅ update UI immediately
    } catch (error) {
      console.error("Failed to update UPI", error);
    }
  };

  if (loading) {
    return <p className="p-6">Loading UPI...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Your UPI ID</h2>

      {/* ✅ Show current UPI */}
      <p className="mb-4 text-gray-700">
        <strong>Current UPI:</strong>{" "}
        {upi ? upi : "Not set"}
      </p>

      {/* ✅ Form */}
      <UpiForm currentUpi={upi} onSave={handleSave} />
    </div>
  );
};

export default AdminUpiPage;