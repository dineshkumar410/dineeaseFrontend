import React from "react";
import { Link, useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  // Function to handle reservation button click
  const handleReserve = () => {
    navigate(`/reservations/${restaurant._id}`); // Navigate to the reservation page
  };

  return (
    <div className="border rounded-lg shadow-md p-4">
      <img
        src={restaurant.photos[0] || "/placeholder.png"}
        alt={restaurant.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-xl font-semibold mt-2">{restaurant.name}</h2>
      <p className="text-gray-500">{restaurant.cuisine}</p>
      <p className="text-gray-600">{restaurant.priceRange}</p>
      <div className="mt-2">
        {/* Once clicked on this button it directs to individual page of this restaurant where user can comment and make reservations */}
        <Link
          to={`/restaurant/${restaurant._id}`}
          className="text-blue-500 hover:underline block"
        >
          View Details
        </Link>
        {/* Reservation button */}
        <button
          onClick={handleReserve}
          className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Make a Reservation
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;
