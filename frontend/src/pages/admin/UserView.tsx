import UsersTable from "../../components/UsersTable";
import { useEffect, useState } from "react";
import { getUserBasedOnDistrict } from "../../services/admin/adminService";
import { adminToggleUserBlock } from "../../services/admin/adminService";



const UserView = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
  const data = await getUserBasedOnDistrict(page, 5, search);
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
  showChat={true}
   role="admin"
   showDetails={true}
  onSearchChange={setSearch}
  showCoordinator={true}
  toggleBlock={async (id) => {
    await adminToggleUserBlock(id);
  }}
   
/>
  );
};

export default UserView;