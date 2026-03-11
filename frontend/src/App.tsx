import { Routes, Route } from "react-router-dom";

import Home from "./pages/user/Home";
import ProfilePage from "./pages/user/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

import UserLayout from "./layouts/UserLayout";
import AdminProtectedRoute from "./components/AdminProtectRoute";
import SuperAdminDashboard from "./pages/superAdmin/dashboard";
import AdminUsers from "./pages/superAdmin/AdminUsers";
import AdminDashboard from "./pages/admin/Dashboard";
import UserView from "./pages/admin/UserView";
import "./i18n/i18n";
import DonationPage from "./pages/user/DonationPage";
import PaymentsPage from "./pages/superAdmin/PaymentsPage";
import Layout from "./layouts/AdminLayout";
import AdminsPage from "./pages/superAdmin/AdminsPage";
import CoordinatorView from "./pages/admin/CoordinatorView";
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
      <Route path="/login/superadmin" element={<Login role="superadmin" />} />
<Route path="/login/admin" element={<Login role="admin" />} />

      {/* ADMIN ROUTES */}
   {/* SUPERADMIN ROUTES */}
 <Route element={<AdminProtectedRoute role="superadmin"><Layout role="superadmin" /></AdminProtectedRoute>}>
  <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
  <Route path="/superadmin/users" element= {<AdminUsers />} />
  <Route path="/superadmin/admins" element={<AdminsPage />} />
</Route>

<Route element={<AdminProtectedRoute role="admin"><Layout role="admin" /></AdminProtectedRoute>}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
 <Route path="/admin/users" element={<UserView />} />
 <Route path="/admin/coordinators" element={<CoordinatorView />} />
  {/* <Route path="/admin/payments" element={<AdminPayments />} />  */}
</Route>
    </Routes>
  );
}

export default App;