import  { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import {
  getCoordinatorProfile,
  changeCoordinatorPassword,
} from "../../services/coordinator/CoordinatorService";

const CoordinatorProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCoordinatorProfile();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (data: any) => {
    try {
      await changeCoordinatorPassword(data);
      alert("Password updated successfully");
      setShowPasswordModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update password");
    }
  };

  return (
    <div className="space-y-4">
      <ProfileCard profile={profile} role="coordinator" />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={() => setShowPasswordModal(true)}
      >
        Change Password
      </button>

      {showPasswordModal && (
        <ChangePasswordModal
          role="coordinator"
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
};

export default CoordinatorProfile;