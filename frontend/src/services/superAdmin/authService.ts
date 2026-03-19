import api from "../api";



export const superAdminLogin = async (email: string, password: string) => {
  const res = await api.post("/superadmin/login", {
    email,
    password,
  });
console.log("Admin login response:", res.data);
  return res.data;
};

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);
  try { 
    const res = await api.get("/superadmin/dashboard/stats", {
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
  const token = localStorage.getItem("token")
  try {
    const res = await api.get("/superadmin/users", {
      params: { page, limit, search },
      headers:{
        Authorization : `Bearer ${token}`
      }
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], totalPages: 0 };
  }
};
export const getAdmins = async (page = 1, limit = 5, search = "") => {
  try {
    const token = localStorage.getItem("token")
    const res = await api.get("/superadmin/admins", {
      params: { page, limit, search },
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Fetched admins:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }   
};

export const createAdmin = async (adminData: { fullName: string; phone: string;email:string, district: string; password: string }) => {
  try {
    const token = localStorage.getItem("token")
    const res = await api.post("/superadmin/create-admin", adminData,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};



export const toggleUserBlock = async(id: string) =>{
  try{
    const token = localStorage.getItem("token");
    const res = await api.patch(`/superadmin/users/block/${id}`,
      {},
     {
      headers : {
       Authorization :`Bearer ${token}`,
      }
     })
     return res.data;
  }catch (error) {
    throw error;
  }
}
 

export const toggleAdminBlock = async (id: string) =>{
  try{
    const token = localStorage.getItem("token")
 const res = await api.patch(`/superadmin/admins/block/${id}`,
  {},
    {
    headers : {
    Authorization : `Bearer ${token}`,
    },
    }
  )
  return res.data;
  }catch (error){
    throw error
  }
  
}

export const updateAdmin = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.put(
      `/superadmin/update-admin/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Update admin error:", error);
    throw error;
  }
};


export const uploadQRCode = async (file: File, amount: number) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("qr", file);
  formData.append("amount", amount.toString());

  const response = await api.post(
    "/superadmin/qr/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getLatestQRCode = async () => {
   const token = localStorage.getItem("token");
  const res = await api.get("/superadmin/qr/latest" ,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });
  return res.data;
};

export const getCoordinators = async (page = 1, limit = 5, search = "") => {
  const token = localStorage.getItem("token");
console.log("TOKEN:", token);
  const res = await api.get("/superadmin/get-coordinators", {
    params: { page, limit, search },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
 console.log("res" , res.data)
  return res.data;
};

export const getAllAdmins = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/superadmin/admins/filter", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // res.data is { admins: [...], totalPages: 1, currentPage: 1 }
    console.log("Fetched admins:", res.data);

    // return the admins array
    return Array.isArray(res.data.admins) ? res.data.admins : [];
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
};

export const getCoordinatorById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(`/superadmin/coordinator/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { _id, fullName, type }
  } catch (error) {
    console.error("Error fetching coordinator:", error);
    return null;
  }
};