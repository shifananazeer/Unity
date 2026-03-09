import { Routes, Route } from "react-router-dom";

import Home from "./pages/user/Home";
import ProfilePage from "./pages/user/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/superAdmin/loginPage";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import SuperAdminDashboard from "./pages/superAdmin/dashboard";
import AdminUsers from "./pages/superAdmin/AdminUsers";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminsPage from "./pages/superAdmin/AdminsPage";
import PaymentsPage from "./pages/superAdmin/PaymentsPage";
import "./i18n/i18n";
import DonationPage from "./pages/user/DonationPage";
function App() {
  return (
    <Routes>

      {/* USER ROUTES */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/donation" element={<DonationPage />} />
      </Route>

      {/* ADMIN LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN ROUTES */}
   {/* ADMIN ROUTES */}
 <Route
  path="/admin"
  element={
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  }
>
  <Route path="dashboard" element={<SuperAdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="admins" element={<AdminsPage />} />
  <Route path="payments" element={<PaymentsPage />} />
</Route>

    </Routes>
  );
}

export default App;