"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/auth"; // Custom auth context
import { signInWithPopup } from "firebase/auth";
import { googleProvider, auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

// List of allowed admin emails
const ADMIN_EMAILS = ["william@educate-one.com", 
  "vvllxn@gmail.com", 
  "sugarland@educate-one.com",
  "nayolyi@educate-one.com",
  "s.james@educate-one.com",
  "matt.shafer@educate-one.com",
  "ross.c@educate-one.com",
  "tutor6@educate-one.com"
];

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Access user from context
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || "";

      // Redirect based on admin status
      if (ADMIN_EMAILS.includes(email)) {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (error) {
      const err = error as Error;
      setLoading(false);
      setError("Failed to log in with Google.");
      console.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-2xl bg-slate-900">
        <h2 className="text-2xl font-bold text-center mb-6">Login / Sign up</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          onClick={handleGoogleLogin}
          className={`w-full py-2 mt-4 bg-blue-600 text-white rounded-lg ${loading ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-700"}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
