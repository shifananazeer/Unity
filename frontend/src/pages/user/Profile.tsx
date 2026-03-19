"use client";

import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/user/profileService";
import ProfileCard from "../../components/user/ProfileCard";
import PaymentHistory from "../../components/user/PaymentHistory";
import ChatModal from "../../components/ChatModal";
import Swal from "sweetalert2";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState<{ type: "coordinator" | "admin" | null }>({ type: null });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await getProfile();
        console.log("PROFILE FRONTEND:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  // If the API returns data inside `user`, use it; otherwise use `profile` directly
  const user = profile?.user || profile;

  // Logged-in user ID
  const loggedInUserId = localStorage.getItem("userId") || "";
  console.log("Logged-in userId:", loggedInUserId);
  console.log("Coordinator ID:", user?.coordinator?._id);
   const handleCopy = (code: string) => {
  if (!code) return;

  navigator.clipboard.writeText(code);

  Swal.fire({
    icon: "success",
    title: "Copied!",
    text: "Referral code copied to clipboard",
    timer: 1200,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
};
  // Early return if profile is not loaded
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <ProfileCard profile={{ user }} setProfile={setProfile} />
         {/* Referral Section */}
<div className="mt-4 bg-white p-4 rounded-lg shadow flex items-center justify-between">
  <div>
    <p className="text-sm text-gray-500">Your Referral Code</p>
    <p className="text-lg font-semibold text-gray-800">
      {user?.referralCode || "N/A"}
    </p>
  </div>

  <button
    onClick={() => handleCopy(user?.referralCode)}
    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 text-sm"
  >
    Copy
  </button>
</div>
        {/* Message Buttons */}
        <div className="mt-4 flex gap-4">
          {user?.coordinator?._id && (
            <button
              onClick={() => setChatOpen({ type: "coordinator" })}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Message Coordinator
            </button>
          )}

          {user?.admin?._id && (
            <button
              onClick={() => setChatOpen({ type: "admin" })}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Message Admin
            </button>
          )}
        </div>

        {/* Payment History */}
        <PaymentHistory />
      </div>

      {/* Chat Modals */}
      {chatOpen.type === "coordinator" && user?.coordinator?._id && (
        <ChatModal
          isOpen={true}
          onClose={() => setChatOpen({ type: null })}
          userId={loggedInUserId}
          receiverRole="coordinator"
          receiverId={user.coordinator._id}
          receiverName={user.coordinator.fullName || "Coordinator"}
        />
      )}

      {chatOpen.type === "admin" && user?.admin?._id && (
        <ChatModal
          isOpen={true}
          onClose={() => setChatOpen({ type: null })}
          userId={loggedInUserId}
          receiverRole="admin"
          receiverId={user.admin._id}
          receiverName={user.admin.fullName || "Admin"}
        />
      )}
    </div>
  );
};

export default ProfilePage;