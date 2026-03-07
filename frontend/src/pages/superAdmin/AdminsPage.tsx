import { useEffect, useState } from "react";
import UsersTable from "../../components/admin/UsersTable";
import { getAdmins } from "../../services/superAdmin/authService";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const data = await getAdmins();
    setAdmins(data);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  return (
    <div>

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Admins</h2>

        <button className="bg-black text-white px-4 py-2 rounded">
          Create Admin
        </button>
      </div>

      <UsersTable title="Admins" users={admins} refreshUsers={fetchAdmins} />

    </div>
  );
};

export default AdminsPage;