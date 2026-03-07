import { Outlet } from "react-router-dom";
import Navbar from "../components/user/Navbar";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;