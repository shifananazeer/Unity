import React, { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import {
  getSuperAdminProfile,
  changeSuperAdminPassword,
} from "../../services/superAdmin/ProfileService";

const SuperAdminProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getSuperAdminProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (data: any) => {
    try {
      await changeSuperAdminPassword(data);
      alert("Password updated successfully");
      setShowPasswordModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update password");
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <ProfileCard profile={profile} role="superadmin" />

      {/* Change Password Button */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        onClick={() => setShowPasswordModal(true)}
      >
        Change Password
      </button>

      {/* Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          role="superadmin"
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
};

export default SuperAdminProfile;