"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  //   const router = useRouter();

  useEffect(() => {
    // Fetch the username or retrieve from local storage / context
    const storedUsername = localStorage.getItem("firstName");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no username, redirect to login
      //   router.push("/login")
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    // Clear session or local storage
    localStorage.removeItem("username");
    localStorage.removeItem("token"); // if using a token for auth
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Hi, {username}!
        </h1>
        <p className="text-gray-600 mb-6">Welcome to your dashboard.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
