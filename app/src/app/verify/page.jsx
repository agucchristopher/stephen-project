"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for 'useRouter' in App Router (if using Next 13)
import { Loader2, AlertCircle } from "lucide-react";

const VerifyOTP = () => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const router = useRouter();

  // Fetch email from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(window.localStorage.getItem("email"));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (otp.length !== 6) {
      setLoading(false);
      return setError("OTP must be exactly 6 digits.");
    }

    try {
      const response = await fetch(
        "https://stephen-project.onrender.com/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({ otp, email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Show success message and navigate to dashboard
      setSuccess("OTP verified successfully! Redirecting to dashboard...");
      if (router) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg shadow-indigo-600/40 transform transition-all duration-300 hover:scale-5 hover:shadow-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Verify OTP
        </h1>

        {error && (
          <div className="flex items-center mb-4 text-red-600 text-sm">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center mb-4 text-green-600 text-sm">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="otp" className="text-gray-700 font-medium">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 border border-gray-300 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
              required
              aria-label="OTP"
              maxLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
