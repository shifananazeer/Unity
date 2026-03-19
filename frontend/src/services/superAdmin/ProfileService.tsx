import api from "../api"

export const getSuperAdminProfile = async () => {
  try{
    const token = localStorage.getItem("token")
    const res = await api.get("/superadmin/profile",
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

export const changeSuperAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.put(
      "/superadmin/change-password",
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
