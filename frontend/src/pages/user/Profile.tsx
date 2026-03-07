"use client";

import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";
import ProfileCard from "../../components/user/ProfileCard";
import PaymentHistory from "../../components/user/PaymentHistory";





const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); 

      if (!token) return;

      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {profile ? (
          <ProfileCard profile={profile} setProfile={setProfile} />
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground text-sm font-medium">Loading profile...</p>
            </div>
          </div>
        )}
         <PaymentHistory />
      </div>
    </div>
  );
};

export default ProfilePage;
