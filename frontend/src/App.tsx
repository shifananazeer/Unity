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
import PaymentsView from "./pages/admin/PaymentView";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import UserViewCoordinator from "./pages/coordinator/UserViewCoordinator";
import PaymentHistory from "./pages/coordinator/PaymentHistory";
import CoordinatorProfile from "./pages/coordinator/CoordinatorProfile";
import QRManagement from "./pages/superAdmin/QRManagementPage";
import SuperAdminCoordinatorView from "./pages/superAdmin/SuperAdminCordinatorView";
import SuperAdminPaymentPage from "./pages/superAdmin/SuperAdminPaymentPage";
import AdminUpiPage from "./pages/admin/AdminUpiPage";
import CoordinatorUpiPage from "./pages/coordinator/CoordinatorUpiPage";
import MissedPaymentsCoordinator from "./pages/coordinator/MissedPaymentsCoordinator";
import MissedPaymentsAdmin from "./pages/admin/MissedPaymentsAdmin";
import DirectSellingPage from "./pages/user/DirectSellingPage";
import RDCommunityPage from "./pages/user/RDCommunityPage";
import SuperAdminProfile from "./pages/superAdmin/SuperAdminProfile";
import AdminProfile from "./pages/admin/AdminProfile";
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
        <Route path="/direct-selling" element={<DirectSellingPage />} />
        <Route path="/rd-community" element={<RDCommunityPage />} />
      </Route>

      {/*  LOGIN */}
      <Route path="/login/superadmin" element={<Login role="superadmin" />} />
<Route path="/login/admin" element={<Login role="admin" />} />
<Route path="/login/coordinator" element={<Login role="coordinator" />} />

    
   {/* SUPERADMIN ROUTES */}
 <Route element={<AdminProtectedRoute role="superadmin"><Layout role="superadmin" /></AdminProtectedRoute>}>
  <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
  <Route path="/superadmin/users" element= {<AdminUsers />} />
  <Route path="/superadmin/admins" element={<AdminsPage />} />
  <Route path="/superadmin/qrcode" element={<QRManagement/>}/>
  <Route path="/superadmin/coordinators" element = {<SuperAdminCoordinatorView/>}/>
  <Route path="/superadmin/payments" element={<SuperAdminPaymentPage/>}/>
  <Route path="/superadmin/profile" element={<SuperAdminProfile/>}/>
</Route>

<Route element={<AdminProtectedRoute role="admin"><Layout role="admin" /></AdminProtectedRoute>}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
 <Route path="/admin/users" element={<UserView />} />
 <Route path="/admin/coordinators" element={<CoordinatorView />} />
  <Route path="/admin/payments" element={<PaymentsView />} /> 
  <Route path="/admin/upi" element={<AdminUpiPage />} />
  <Route path="/admin/missedPayments" element={<MissedPaymentsAdmin />} />
  <Route path="/admin/profile" element={<AdminProfile/>} />
  
</Route>

{/* COORDINATOR ROUTES */}
<Route
  element={
    <AdminProtectedRoute role="coordinator">
      <Layout role="coordinator" />
    </AdminProtectedRoute>
  }
>
  <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
  <Route path="/coordinator/users" element={<UserViewCoordinator />} />
   <Route path="/coordinator/payments" element={<PaymentHistory/>} />
 <Route path="/coordinator/missedPayments" element={<MissedPaymentsCoordinator />} />
  <Route path="/coordinator/profile" element={<CoordinatorProfile />} />
  <Route path="/coordinator/upi" element={<CoordinatorUpiPage />} />
</Route>
    </Routes>
  );
}

export default App;