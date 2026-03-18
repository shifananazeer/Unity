import React, { useState } from "react";

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

        {/* <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
          Edit
        </button> */}
      </div>

      <div className="space-y-3">
        <p><strong>Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
         <p><strong>Area:</strong> {profile.area}</p>

      

        <p><strong>Type:</strong> {profile.type}</p>

        {profile.district && (
          <p><strong>District:</strong> {profile.district}</p>
        )}

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