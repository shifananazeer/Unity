import UsersTable from "../../components/UsersTable";
import { getUsers } from "../../services/superAdmin/authService";
import { useEffect, useState } from "react";
import { toggleAdminBlock , toggleUserBlock ,  } from "../../services/superAdmin/authService";
import { getCoordinators } from "../../services/superAdmin/authService";



const SuperAdminCoordinatorView = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [totalPages, setTotalPages] = useState(1);

  const fetchCoordinators = async () => {
  const data = await getCoordinators(page, 5, search);
  console.log(data)
  setCoordinators(data.coordinators);
  setTotalPages(data.totalPages);
};

  useEffect(() => {
    fetchCoordinators();
  }, [page, search]);

  return (
   <UsersTable
  title="Coordinators"
  users={coordinators}
  refreshUsers={fetchCoordinators}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  onSearchChange={setSearch}
  role="superadmin"
  showCoordinatorExtra={true}
  showCoordinatorType
  toggleBlock={async (id, role) => {
    if (role === "superadmin") {
      await toggleAdminBlock(id);
    } else {
      await toggleUserBlock(id);
    }
  }}
/>
  );
};

export default SuperAdminCoordinatorView;