import { useEffect, useState } from "react";
import MissedPaymentsTable from "../../components/MissedPaymentsTable";
import { getMissedPayments , removeUser } from "../../services/coordinator/CoordinatorService";

const MissedPaymentsCoordinator = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getMissedPayments(); // backend returns users with missedMonths
    setUsers(data.users);
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
      <h2 className="text-2xl font-semibold mb-4">Users with Missed Payments</h2>
      <MissedPaymentsTable users={users}
         showHierarchy={true} 
         role="coordinator"
          onRemove={handleRemove}
  />
    </div>
  );
};

export default MissedPaymentsCoordinator