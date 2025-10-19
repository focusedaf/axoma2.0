import React from "react";

export default function OnboardingPage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Axoma!</h1>
      <p className="text-lg text-gray-600">
        Let's get your profile set up. This will only take 2 minutes.
      </p>

      <div className="space-y-3 text-left max-w-md mx-auto mt-8">
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-gray-700">Complete your profile</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-gray-700">Verify your credentials</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-gray-700">Get access to the platform</span>
        </div>
      </div>
    </div>
  );
}
