import UsersTable from "../../components/admin/UsersTable";
import { getUsers } from "../../services/superAdmin/authService";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  phone: string;
  role: string;
  isBlocked: boolean;
}


const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const data = await getUsers();
    console.log("Fetched users:", data);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersTable
      title="All Users"
      users={users}
      refreshUsers={fetchUsers}
    />
  );
};

export default AdminUsers;