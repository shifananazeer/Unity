import React, { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import {
  getAdminProfile,
  changeAdminPassword,
} from "../../services/admin/adminService";

const AdminProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (data: any) => {
    try {
      await changeAdminPassword(data);
      alert("Password updated successfully");
      setShowPasswordModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update password");
    }
  };

  return (
    <div className="space-y-4">
      <ProfileCard profile={profile} role="admin" />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={() => setShowPasswordModal(true)}
      >
        Change Password
      </button>

      {showPasswordModal && (
        <ChangePasswordModal
          role="admin"
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
};

export default AdminProfile;