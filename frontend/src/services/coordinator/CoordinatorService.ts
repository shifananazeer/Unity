import api from "../api";

export const coordinatorLogin =async (email: string, password: string) => {
  const res = await api.post("/coordinator/login", {
    email,
    password,
  });
   localStorage.setItem("coordinatorId", res.data.coordinator._id);
  console.log("coo Id" , res.data.coordinator._id)
console.log("coordinator login response:", res.data);
  return res.data;
};

export const getCoordinatorDashboardStats = async () => {
     const token  = localStorage.getItem("token")
     console.log("/coordinator token " , token)
      try {
        const res = await api.get("/coordinator/dashboard-stats" ,{
            headers:{
                Authorization :`Bearer ${token}`,
            }
        });
        console.log("data stats " , res.data)
        return res.data;
    } catch (error) {
        console.error("Failed to fetch coordinator dashboard stats:", error);
        throw error;
    }
}

export const getUser = async(page = 1 , limit = 5 , search = "") => {
const token = localStorage.getItem("token")
try{
    const res = await api.get("/coordinator/users", {
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

export const coordinatorToggleUserBlock = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.patch(
      `/coordinator/toggle-user-block/${userId}`,
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

export const getPayments = async () => {
  try{
    const token = localStorage.getItem("token")
    const res = await api.get("/coordinator/payments",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    console.log("payments" , res.data)
    return res.data;
  }catch (error) {
 console.error("Error fetching payments:", error);
    return [];
  }
}

export const getCoordinatorProfile = async () => {
  try{
    const token = localStorage.getItem("token")
    const res = await api.get("/coordinator/profile",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    console.log("profile" , res.data)
    return res.data;
  }catch (error) {
 console.error("Error fetching profile:", error);
    return [];
  }   
}

export const changeCoordinatorPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.put(
      "/coordinator/change-password",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Change password error:", error.response?.data || error);
    throw error;
  }
};

export const getCoordinatorUpi = async () => {
    const token = localStorage.getItem("token");
  const res = await api.get("/coordinator/coordinator-upi" ,
     {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
  );
  return res.data;
};

export const updateCoordinatorUpi = async (upiId: string) => {
    const token = localStorage.getItem("token");
  const res = await api.put("/coordinator/coordinator-upi", { upiId } ,
     {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
  );
  return res.data;
};

export const getMissedPayments = async () => {
  try {
    console.log("service")
    const token = localStorage.getItem("token");
    const res = await api.get("/coordinator/missed-payments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return res.data;
  } catch (error) {
    console.error("Failed to fetch missed payments:", error);
    throw error;
  }
};

export const removeUser = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.delete(`/coordinator/remove-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

export const getUserDetails = async (userId: string) => {
  console.log("use Id" , userId)
  try{
    const token = localStorage.getItem("token");
  const res = await api.get(`/coordinator/userdetails/${userId}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return res.data;
}catch (error) {
  console.error("Failed to fetch details:", error);
    throw error;
}
};
