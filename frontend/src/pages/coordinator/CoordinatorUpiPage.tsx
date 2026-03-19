import React, { useEffect, useState } from "react";
import UpiForm from "../../components/UpiForm";
import { updateCoordinatorUpi, getCoordinatorUpi } from "../../services/coordinator/CoordinatorService";

const CoordinatorUpiPage: React.FC = () => {

  const [upi, setUpi] = useState("");

  useEffect(() => {
    fetchUpi();
  }, []);

  const fetchUpi = async () => {
    const data = await getCoordinatorUpi();
    setUpi(data.upiId);
  };

  const handleSave = async (upiId: string) => {
    await updateCoordinatorUpi(upiId);
  };

  return (
    <div className="p-6">
       <h2 className="text-lg font-semibold mb-4">Your UPI ID</h2>

      {/* ✅ Show current UPI */}
      <p className="mb-4 text-gray-700">
        <strong>Current UPI:</strong>{" "}
        {upi ? upi : "Not set"}
      </p>
      <UpiForm currentUpi={upi} onSave={handleSave} />
    </div>
  );
};

export default CoordinatorUpiPage;