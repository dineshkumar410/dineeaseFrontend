import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Check if the user is logged in by looking for a valid token in localStorage
  const isLoggedIn = localStorage.getItem("token");

  const handleSignOut = () => {
    // Clear the token from localStorage and redirect to the login page
    localStorage.removeItem("token");
    // Clear the userId from localStorage once user is logged out
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">
          DineEase
        </Link>
        <div className="space-x-4">
          {/* Always show the Search and Reservations links */}
          <Link to="/search" className="hover:text-gray-200">
            Search
          </Link>
          <Link to="/reservations" className="hover:text-gray-200">
            Reservations
          </Link>

          {/* Conditionally show Login/Register or Profile/Sign Out based on isLoggedIn */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-200">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-gray-200">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="hover:text-gray-200 bg-transparent border-none cursor-pointer"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
