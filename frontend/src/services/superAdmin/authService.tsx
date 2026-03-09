import api from "../api";



export const adminLogin = async (email: string, password: string) => {
  const res = await api.post("/admin/login", {
    email,
    password,
  });
console.log("Admin login response:", res.data);
  return res.data;
};

export const getDashboardStats = async () => {
  const token = localStorage.getItem("adminToken");
  try { 
    const res = await api.get("/admin/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
};

export const getUsers = async (page = 1, limit = 5, search = "") => {
  try {
    const res = await api.get("/admin/users", {
      params: { page, limit, search },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], totalPages: 0 };
  }
};
export const getAdmins = async (page = 1, limit = 5, search = "") => {
  try {
    const res = await api.get("/admin/admins", {
      params: { page, limit, search },
    });
    console.log("Fetched admins:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }   
};

export const createAdmin = async (adminData: { fullName: string; phone: string; district: string; password: string }) => {
  try {
    const res = await api.post("/admin/create-admin", adminData);
    return res.data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};



export const toggleUserBlock = async(id: string) =>
  await api.patch(`/users/block/${id}`);

export const toggleAdminBlock = async (id: string) =>
  await api.patch(`/admin/block/${id}`);

export const updateAdmin = async (id: string, data: any) => {
  const res = await api.put(`/admin/update-admin/${id}`, data);
  return res.data;
};