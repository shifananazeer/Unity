import api from "./api"; // import your axios instance

// Get user profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await api.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Profile fetched successfully:", res.data);
    return res.data;
    
  } catch (error: any) {
    console.error("Failed to fetch profile:", error.response || error.message);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData: any ) => {
  const token = localStorage.getItem("token");
  try {
    const res = await api.put("/user/profile", profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to update profile:", error.response || error.message);
    throw error;
  }
};

export const uploadProfilePic = async (file: File ) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("profilePic", file);
  try {
    const res = await api.post("/user/profile/pic", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to upload profile picture:", error.response || error.message);
    throw error;
  }
};

export const getUserPayments = async () => {
  const token = localStorage.getItem("token");
  try {     const res = await api.get("/user/payments", {
      headers: {
        Authorization: `Bearer ${token}`,   
        },
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch user payments:", error.response || error.message);
    throw error;
  }
};

