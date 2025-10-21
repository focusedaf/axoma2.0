"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StudentProfileForm from "@/components/ui-elements/forms/studentProfileForm";
import ProfessorProfileForm from "@/components/ui-elements/forms/professorProfileForm";
import axios from "axios";

export default function ProfilePage() {
  const { userRole, refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      await refresh();
      if (!userRole) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          userRole === "student"
            ? ""
            : ""
        );
        setProfileData(res.data.data || null); 
      } catch (err) {
        console.error(err);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [refresh, userRole]);

  if (loading) return <p>Loading...</p>;
  if (!userRole) return <p>Error: Could not determine role</p>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Set up your profile</h1>
      {userRole === "student" ? (
        <StudentProfileForm existingData={profileData} />
      ) : (
        <ProfessorProfileForm existingData={profileData} />
      )}
    </div>
  );
}
