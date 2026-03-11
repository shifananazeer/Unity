import api from "../api";

export const getAdminDashboardStats = async () => {
    const token  = localStorage.getItem("adminToken")
    console.log("tokrn ", token)
    try {
        const res = await api.get("/admin/dashboard-stats" ,{
            headers:{
                Authorization :`Bearer ${token}`,
            }
        });
        console.log("data stats " , res.data)
        return res.data;
    } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
        throw error;
    }
};

export const adminLogin = async (email: string, password: string) => {
  const res = await api.post("/admin/login", {
    email,
    password,
  });
console.log("Admin login response:", res.data);
  return res.data;
};


export const getUserBasedOnDistrict = async(page = 1 , limit = 5 , search = "") => {
const token = localStorage.getItem("adminToken")
try{
    const res = await api.get("/admin/users", {
        params: { page, limit, search },
      headers:{
        Authorization : `Bearer ${token}`
      }
    })
    console.log("data" , res.data)
    return res.data;
}catch (error) {
   console.error("Error fetching users:", error);
    return { users: [], totalPages: 0 };
}
}

export const adminToggleUserBlock = async (userId: string) => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await api.patch(
      `/admin/toggle-user-block/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Admin toggle block error:", error);
    throw error;
  }
};

export const getCoordinators = async (page = 1, limit = 5 , search ="") => {
 try {
    const token = localStorage.getItem("adminToken");

    const res = await api.get( "/admin/get-coordinators",{
   params: { page, limit, search },
      headers:{
        Authorization : `Bearer ${token}`
      }
    }
      
    );
console.log("Coordinator data" , res.data)
    return res.data; 
  } catch (error) {
    console.error("Get coordinators error:", error);
  }
}

export const updateCoordinator = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await api.put(
      `/admin/update-coordinator/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Update coordinator error:", error);
    throw error;
  }
};

export const createCoordinator = async (data: any) => {
  try{
  const token = localStorage.getItem("adminToken")
  const response = await api.post(
    "/admin/create-coordinator",
    data,{
      headers: {
        Authorization:`Bearer ${token}`
      }
    }
  );

  return response.data;
}catch (error) {
   console.error(" coordinator creation error:", error);
  throw error
}
};

export const toggleCoordinatorBlock = async (id: string) =>{
  try{
    const token = localStorage.getItem("adminToken")
 const res = await api.patch(`/admin/coordinators/block/${id}`,
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