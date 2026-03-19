import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// ✅ REQUEST INTERCEPTOR (attach token automatically)
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("superAdminToken") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("coordinatorToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ✅ RESPONSE INTERCEPTOR (handle expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expired or unauthorized");

      // ❌ Remove all tokens
      localStorage.removeItem("superAdminToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("coordinatorToken");

      // 🔁 Redirect based on role (optional smart redirect)
      const currentPath = window.location.pathname;

      if (currentPath.includes("/superadmin")) {
        window.location.href = "/login/superadmin";
      } else if (currentPath.includes("/admin")) {
        window.location.href = "/login/admin";
      } else if (currentPath.includes("/coordinator")) {
        window.location.href = "/login/coordinator";
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;