import { Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import ProfilePage from "./pages/user/Profile";
import Navbar from "./components/user/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* Navbar is outside Routes */}
      <Navbar />

      {/* Routes only has <Route> or <React.Fragment> */}
         <div className="pt-20">
      <Routes>
        <Route path="/" element={<Home />} />
       <Route
         path="/profile"
         element={
         <ProtectedRoute allowedRoles={["user"]}>
           <ProfilePage />
         </ProtectedRoute>
         }
      />
      </Routes>
      </div>
    </>
  );
}

export default App;