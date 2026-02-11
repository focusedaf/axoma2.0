"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StudentProfileForm from "@/components/ui-elements/forms/studentProfileForm";
import ProfessorProfileForm from "@/components/ui-elements/forms/professorProfileForm";
import { getProfile } from "@/lib/api";
import LoaderSpinner from "@/components/ui-elements/LoaderSpinner";

export default function ProfilePage() {
  const { user, refresh, isLoggedIn } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await refresh();

        const userRole =
          localStorage.getItem("auth_role") ||
          localStorage.getItem("pending_role");

        setRole(userRole);

        try {
          const res = await getProfile();
          setProfileData(res.data?.data || null);
        } catch (err: any) {
          if (err?.response?.status !== 404) {
            console.error("Profile fetch error:", err);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []); 

  const handleProfileSuccess = () => {
    router.push("/onboarding/verify-document");
  };

  useEffect(() => {
    (window as any).submitProfileForm = () => {
      const form = document.getElementById("profile-form") as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-4">
          Could not determine your account type. Please try logging in again.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:underline"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Set up your profile</h1>
      <p className="text-gray-600 mb-8">
        Tell us a bit about yourself to complete your registration
      </p>

      {role === "student" ? (
        <StudentProfileForm
          existingData={profileData}
          onSuccess={handleProfileSuccess}
        />
      ) : (
        <ProfessorProfileForm
          existingData={profileData}
          onSuccess={handleProfileSuccess}
        />
      )}
    </div>
  );
}
