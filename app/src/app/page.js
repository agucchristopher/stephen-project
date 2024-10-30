"use client";
import React, { useEffect, useState } from "react";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    let checkUsername = window.localStorage.getItem("firstName");
    if (checkUsername) {
      window.location.href = "/dashboard";
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setusername(value);
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setpassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // throw new Error(data.message || "Login failed");
        console.log(data.message || "Login failed");
      }

      // Store the token in localStorage
      if (data) {
        localStorage.setItem("email", data.user.email);
      }
      // Store the firstname in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (response.ok) {
        // Handle successful login
        alert(data.message || "Login successful");
        window.location.href = "/verify"; // Redirect to dashboard or home page
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg shadow-indigo-600/40 transform transition-all duration-300 hover:scale-5 hover:shadow-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Welcome Back
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={username}
                onChange={handleChange}
                className="w-full px-4 py-3 mt-1 rounded-xl text-black bg-gray-100 border border-gray-300 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                required
                aria-label="Email"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 mt-1 rounded-xl text-black bg-gray-100 border border-gray-300 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 pr-12"
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>

          {/* OAuth Buttons */}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
