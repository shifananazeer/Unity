import React, { useEffect, useState } from "react";
import UpiForm from "../../components/UpiForm"
import { updateAdminUpi, getAdminUpi } from "../../services/admin/adminService";

const AdminUpiPage: React.FC = () => {

  const [upi, setUpi] = useState("");

  useEffect(() => {
    fetchUpi();
  }, []);

  const fetchUpi = async () => {
    const data = await getAdminUpi();
    setUpi(data.upiId);
  };

  const handleSave = async (upiId: string) => {
    await updateAdminUpi(upiId);
  };

  return (
    <div className="p-6">
      <UpiForm currentUpi={upi} onSave={handleSave} />
    </div>
  );
};

export default AdminUpiPage;