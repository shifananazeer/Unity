import UsersTable from "../../components/UsersTable";
import { getUsers } from "../../services/superAdmin/authService";
import { useEffect, useState } from "react";
import { toggleAdminBlock , toggleUserBlock } from "../../services/superAdmin/authService";




const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(false);

   const fetchUsers = async () => {
    setLoading(true); // start loading
    try {
      const data = await getUsers(page, 5, search);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false); // stop loading
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [page, search]);
if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </div>
    );
  }

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
   role="superadmin"
   showDetails={true}
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