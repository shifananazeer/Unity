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
  const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
  const data = await getUsers(page, 5, search);
  setUsers(data.users);
  setTotalPages(data.totalPages);
};

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  return (
    <UsersTable
      title="All Users"
      users={users}
      refreshUsers={fetchUsers}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      onSearchChange={setSearch}
    />
  );
};

export default AdminUsers;