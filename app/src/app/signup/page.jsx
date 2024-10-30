"use client";
import React, { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    isStrong: false,
    message: "",
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isStrong =
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar;

    let message = "";
    if (!isStrong) {
      message = "Password must contain at least:";
      if (password.length < minLength) message += " 8 characters,";
      if (!hasUpperCase) message += " 1 uppercase letter,";
      if (!hasLowerCase) message += " 1 lowercase letter,";
      if (!hasNumbers) message += " 1 number,";
      if (!hasSpecialChar) message += " 1 special character,";
      message = message.slice(0, -1); // Remove trailing comma
    }

    return { isStrong, message };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.localStorage.setItem("email", formData.email);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://auth-system-backend-sepia.vercel.app/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // throw new Error(data.error || "Signup failed");
        setError(data.error || "Signup failed");
      }

      if (response.ok) {
        // Redirect to OTP verification page on success
        window.location.href = "/login";
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg shadow-indigo-600/40 transform transition-all duration-300 hover:scale-5 hover:shadow-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {[
              { id: "firstName", label: "First Name", type: "text" },
              { id: "lastName", label: "Last Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "password", label: "Password", type: "password" },
            ].map((field) => (
              <div key={field.id} className="relative">
                <label htmlFor={field.id} className="text-gray-700 font-medium">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mt-1 rounded-xl text-black bg-gray-100 border border-gray-300 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                  required
                  aria-label={field.label}
                />
              </div>
            ))}
          </div>

          {formData.password && !passwordStrength.isStrong && (
            <Alert variant="warning" className="mt-2">
              <AlertDescription>{passwordStrength.message}</AlertDescription>
            </Alert>
          )}

          <button
            type="submit"
            disabled={loading || !passwordStrength.isStrong}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
