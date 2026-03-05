import api from "./api";


 export const loginUser  = async (mobileNumber: string, password: string) => {
        const res = await api.post("/auth/login", { mobileNumber, password });
        console.log("Login successful:", res.data);
        return res.data;
  }; 

export const signupUser = async (fullName: string, mobileNumber: string, pinCode: string, district: string, state: string, localBody: string, password: string) => {
    const res = await api.post("/auth/signup", { fullName, mobileNumber, pinCode, district, state, localBody, password });
    console.log("Signup successful:", res.data);
    return res.data;
};


