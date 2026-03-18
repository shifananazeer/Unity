import UsersTable from "../../components/UsersTable";
import { useEffect, useState } from "react";
import { getUser, coordinatorToggleUserBlock } from "../../services/coordinator/CoordinatorService";

export interface User {
  _id: string;
  fullName: string;
  role: string;
  district?: string;
  isBlocked: boolean;
  mobileNumber: string;
  coordinator?: {
    fullName: string;
    type: string;
  };
  admin?: {
    fullName: string;
  };
  type?: "nano" | "micro"; // optional, mainly for super admin
}


const UserViewCoordinator = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
 

  const fetchUsers = async () => {
    try {
      const data = await getUser(page, 5, search); // getUser now calls the updated backend

      // Save users
      setUsers(data.users);
      setTotalPages(data.totalPages);

      // Save coordinator type
     
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalPages(1);
    }
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
     showCoordinator={false}
      showChat={true}
      toggleBlock={async (id) => {
        await coordinatorToggleUserBlock(id);
        fetchUsers(); // refresh table after toggle
      }}
    />
  );
};

export default UserViewCoordinator;