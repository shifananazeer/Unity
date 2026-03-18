import UsersTable from "../../components/UsersTable";
import { getUsers } from "../../services/superAdmin/authService";
import { useEffect, useState } from "react";
import { toggleAdminBlock , toggleUserBlock } from "../../services/superAdmin/authService";

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
  title="Users"
  users={users}
  refreshUsers={fetchUsers}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  onSearchChange={setSearch}
   showHierarchy={true}
  toggleBlock={async (id, role) => {
    if (role === "admin") {
      await toggleAdminBlock(id);
    } else {
      await toggleUserBlock(id);
    }
  }}
/>
  );
};

export default AdminUsers;