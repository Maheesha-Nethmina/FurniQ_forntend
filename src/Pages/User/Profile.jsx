// src/Pages/User/Profile.jsx
import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white pt-32">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-amber-400">My Profile</h1>
          {user ? (
            <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
              <p className="text-lg">
                <span className="font-semibold text-gray-400">Username:</span>{" "}
                {user.username}
              </p>
              <p className="text-lg mt-4">
                <span className="font-semibold text-gray-400">Email:</span>{" "}
                {user.email}
              </p>
              <p className="text-lg mt-4">
                <span className="font-semibold text-gray-400">Role:</span>{" "}
                {user.role}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-lg text-gray-300">Loading user data...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;