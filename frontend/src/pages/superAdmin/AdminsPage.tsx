import { useEffect, useState } from "react";
import UsersTable from "../../components/superAdmin/UsersTable";
import { getAdmins } from "../../services/superAdmin/authService";
import CreateAdminModal from "../../components/superAdmin/CreateAdminModal";
import EditAdminModal from "../../components/superAdmin/EditAdminModal";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
   const [openModal, setOpenModal] = useState(false);
   const [page, setPage] = useState(1);
    const [search, setSearch] = useState(""); 
    const [totalPages, setTotalPages] = useState(1);
    const [editAdmin, setEditAdmin] = useState<any>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

 const fetchAdmins = async () => {
  const data = await getAdmins(page, 5, search);
  setAdmins(data.admins);
  setTotalPages(data.totalPages);
};

  // const columns = [
  //   { header: "Name", accessor: "name" },
  //   { header: "Email", accessor: "email" },
  //   { header: "Role", accessor: "role" },
  // ];

  return (
    <div>

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Admins</h2>

        <button
          onClick={() => setOpenModal(true)}
         className="bg-black text-white px-4 py-2 rounded">
          Create Admin
        </button>
      </div>

   <UsersTable
  title="Admins"
  users={admins}
  refreshUsers={fetchAdmins}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  onSearchChange={(value) => {
    setPage(1);
    setSearch(value);
  }}
  showEdit={true}
  onEdit={(admin) => setEditAdmin(admin)}
/>

     {openModal && (
        <CreateAdminModal
          onClose={() => setOpenModal(false)}
          onAdminCreated={fetchAdmins}
        />
      )}
      {/* EDIT ADMIN MODAL */}
       {editAdmin && ( <EditAdminModal admin={editAdmin} 
       onClose={() => setEditAdmin(null)} 
       onAdminUpdated={() => 
       { fetchAdmins(); setEditAdmin(null); }} /> )}
    </div>
  );
};

export default AdminsPage;