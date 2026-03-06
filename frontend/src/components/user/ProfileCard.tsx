import React, { useState } from "react";
import EditProfileModal from "./EditProfileModal";



interface User {
  _id?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  pinCode?: string;
  district?: string;
  state?: string;
  localBody?: string;
  profilePicUrl?: string;
}

interface Profile {
  user?: User;
}

interface Props {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.split(" ");
  return parts.map((p) => p[0]).join("").toUpperCase();
};

const ProfileCard: React.FC<Props> = ({ profile, setProfile }) => {
  const [editOpen, setEditOpen] = useState(false);

  console.log("Rendering ProfileCard with profile:", profile);

  // normalize data
  const user = profile?.user;

  return (
    <>
      <div className="overflow-hidden bg-green-200 rounded-xl shadow-lg border border-border bg-card">
 
       {/* Header */}
<div className="relative bg-green-200 pb-20">
  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">

    {user?.profilePicUrl ? (
      <img
        src={import.meta.env.VITE_BACKEND_URL + user.profilePicUrl}
        alt="Profile"
        className="h-24 w-24 rounded-full ring-4 ring-white shadow-xl object-cover"
      />
    ) : (
      <div className="h-24 w-24 rounded-full ring-4 ring-white shadow-xl bg-green-500 text-white flex items-center justify-center text-2xl font-semibold">
        {getInitials(user?.fullName)}
      </div>
    )}

  </div>
</div>

        {/* Content */}
        <div className="pt-16 pb-8 px-6">

          {/* Name */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {user?.fullName || "User"}
            </h2>
          </div>
          

          {/* Info Section */}
         <div className="pt-10 pb-8 px-6 bg-orange-200 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Phone */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                📞
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase">
                  Phone
                </span>
                <span className="text-sm font-medium">
                  {user?.mobileNumber || "Not Provided"}
                </span>
              </div>
            </div>

            {/* District */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                📍
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase">
                  District
                </span>
                <span className="text-sm font-medium">
                  {user?.district || "Not Provided"}
                </span>
              </div>
            </div>

            {/* Pin Code */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                🏠
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase">
                  Pin Code
                </span>
                <span className="text-sm font-medium">
                  {user?.pinCode || "Not Provided"}
                </span>
              </div>
            </div>

            {/* State */}
<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted">
  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
    🌎
  </div>
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground uppercase">
      State
    </span>
    <span className="text-sm font-medium">
      {user?.state || "Not Provided"}
    </span>
  </div>
</div>

{/* Local Body */}
<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted">
  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
    🏛️
  </div>
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground uppercase">
      Local Body
    </span>
    <span className="text-sm font-medium">
      {user?.localBody || "Not Provided"}
    </span>
  </div>
</div>

          </div>

          {/* Edit Button */}
          <div className="mt-8">
            <button
              onClick={() => setEditOpen(true)}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              ✏️ Edit Profile
            </button>
          </div>

        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditProfileModal
          profile={user}
          setProfile={setProfile}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileCard;