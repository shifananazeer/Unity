import React from "react";

interface ProfileCardProps {
  profile: any;
  role: "superadmin" | "admin" | "coordinator";
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, role }) => {
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold capitalize">{role} Profile</h2>
      </div>

      <div className="space-y-3">
        {/* Common fields */}
        {profile.fullName && (
          <p><strong>Name:</strong> {profile.fullName}</p>
        )}

        {profile.email && (
          <p><strong>Email:</strong> {profile.email}</p>
        )}

        {/* Show only for admin & coordinator */}
        {role !== "superadmin" && profile.phone && (
          <p><strong>Phone:</strong> {profile.phone}</p>
        )}

        {role !== "superadmin" && profile.area && (
          <p><strong>Area:</strong> {profile.area}</p>
        )}

        {role !== "superadmin" && profile.type && (
          <p><strong>Type:</strong> {profile.type}</p>
        )}

        {/* District (only if exists) */}
        {profile.district && (
          <p><strong>District:</strong> {profile.district}</p>
        )}

        {/* Joined date */}
        {profile.createdAt && (
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;