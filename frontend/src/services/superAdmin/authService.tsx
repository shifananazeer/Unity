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

export const getUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getAdmins = async () => {
  try {
    const res = await api.get("/admin/admins");   
    return res.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }   
};