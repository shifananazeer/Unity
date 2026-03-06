import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile";
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
            <ProtectedRoute>
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