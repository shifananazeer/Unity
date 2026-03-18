import { useEffect, useState } from "react";
import MissedPaymentsTable from "../../components/MissedPaymentsTable";
import { getAdminMissedpayments ,removeUser } from "../../services/admin/adminService";

const MissedPaymentsAdmin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAdminMissedpayments();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching admin missed payments", error);
    }
  };

   const handleRemove = async (userId: string) => {
    try {
      await removeUser(userId);

      // refresh list after delete
      setUsers((prev) => prev.filter((u: any) => u._id !== userId));

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Users with Missed Payments
      </h2>

      <MissedPaymentsTable
        users={users}
        showHierarchy={true} // shows coordinator + admin
         role="admin"
         onRemove={handleRemove}
     
      />
    </div>
  );
};

export default MissedPaymentsAdmin;