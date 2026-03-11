import React, { useEffect, useState } from "react";
import UsersTable from "../../components/superAdmin/UsersTable";
import CreateCoordinatorModal from "../../components/admin/CreateCoordinatorModal";
import EditCoordinatorModal from "../../components/admin/EditCoordinatorModal";
import { getCoordinators ,toggleCoordinatorBlock } from "../../services/admin/adminService";

const CoordinatorView = () => {
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [editCoordinator, setEditCoordinator] = useState<any>(null);

  useEffect(() => {
   
    fetchCoordinators();
   
  }, [page, search]);

  const fetchCoordinators = async () => {
    const data = await getCoordinators(page, 5, search);
    console.log("coor" , data)
    setCoordinators(data.coordinators);
    setTotalPages(data.totalPages);
  };

  
  const handleToggleBlock = async (id: string) => {
  try {
    await toggleCoordinatorBlock(id);
    fetchCoordinators(); // refresh table
  } catch (error) {
    console.error("Block coordinator error", error);
  }
};

  return (
    <div>

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Coordinators</h2>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Coordinator
        </button>
      </div>

      <UsersTable
        title="Coordinators"
        users={coordinators}
        refreshUsers={fetchCoordinators}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
         toggleBlock={(id) => handleToggleBlock(id)}
        showEdit={true}
        onEdit={(coordinator) => setEditCoordinator(coordinator)}
      />

      {/* CREATE */}
      {openModal && (
        <CreateCoordinatorModal
          onClose={() => setOpenModal(false)}
          onCoordinatorCreated={fetchCoordinators}
        />
      )}

      {/* EDIT */}
      {editCoordinator && (
        <EditCoordinatorModal
          coordinator={editCoordinator}
          onClose={() => setEditCoordinator(null)}
          onCoordinatorUpdated={() => {
            fetchCoordinators();
            setEditCoordinator(null);
          }}
        />
      )}
    </div>
  );
};

export default CoordinatorView;