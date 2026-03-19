import api from "../api";


 export const loginUser  = async (mobileNumber: string, password: string) => {
        const res = await api.post("/auth/login", { mobileNumber, password });
       const userId = res.data.user._id;
    
  
    localStorage.setItem("userId", userId); 
    
    console.log("userId saved:", userId);
        console.log("Login successful:", res.data);
        return res.data;
  }; 

export const signupUser = async (fullName: string, mobileNumber: string, pinCode: string, district: string, state: string, localBody: string, password: string, type:string ,referralCode:string) => {
    const res = await api.post("/auth/signup", { fullName, mobileNumber, pinCode, district, state, localBody, password, type , referralCode });
    const userId = res.data.user._id;
    
    // Save to localStorage
    localStorage.setItem("userId", userId); 
    
    console.log("userId saved:", userId);
    console.log("Signup successful:", res.data);
    return res.data;
};

export const joinRD = async (packageName: string) => {
  const token = localStorage.getItem("token");

  const res = await api.post(
    "/user/rd/join",
    { packageName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getRDStatus = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/user/rd/status", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


