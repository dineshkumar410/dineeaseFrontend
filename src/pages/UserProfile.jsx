import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch the user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "https://dineease-91l7.onrender.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Update the user
  const handleUpdateProfile = async (updatedUser) => {
    try {
      await axios.patch(
        "https://dineease-91l7.onrender.com/api/users/profile",
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser({ ...user, ...updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Clear userId from localStorage
    localStorage.removeItem("userId");

    // Redirect to login page
    navigate("/login");
  };

  const handleCheckReservations = () => {
    // Navigate to the reservations page
    navigate("/reservations");
  };

  const handleAdminDashboard = () => {
    // Navigate to the admin dashboard
    navigate("/admin");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-semibold mb-4">You are not logged in.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="mt-4">
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => handleUpdateProfile({ name: e.target.value })}
          className="border p-2 rounded-md w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block font-semibold">Email</label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="border p-2 rounded-md w-full bg-gray-100"
        />
      </div>
      <div className="mt-6">
        <button
          onClick={handleCheckReservations}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full mb-4"
        >
          Check Your Reservations
        </button>
      </div>
      {/* Conditionally rendering admin button */}
      {user.isAdmin ? (
        <div className="mt-6">
          <button
            onClick={handleAdminDashboard}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 w-full"
          >
            Go to Admin Dashboard
          </button>
        </div>
      ) : (
        <div className="mt-6 text-red-500">
          <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 w-full">
            You're not an Admin
          </button>
        </div>
      )}
      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 w-full"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
