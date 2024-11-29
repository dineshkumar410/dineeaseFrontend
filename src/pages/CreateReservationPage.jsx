import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Get the restaurantId from URL
function CreateReservationPage() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    partySize: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the restaurant details by restaurantId
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(
          `https://dineease-91l7.onrender.com/api/restaurants/${restaurantId}`
        );
        console.log(response);
        setRestaurant(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData({
      ...reservationData,
      [name]: value,
    });
  };

  // Handle reservation form submission
  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://dineease-91l7.onrender.com/api/reservations",
        {
          ...reservationData,
          restaurantId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming user is logged in
          },
        }
      );
      alert("Reservation successful!");
      setTimeout(() => {
        navigate("/reservations");
      }, 1000);
    } catch (error) {
      alert("Error making reservation.");
      console.error("Error making reservation:", error);
    }
  };

  if (loading) {
    return <div>Loading restaurant details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Make a Reservation</h1>
      <div>
        <h2 className="text-xl font-semibold">{restaurant.name}</h2>
        <p className="text-gray-500">{restaurant.cuisine}</p>
        <p className="text-gray-600">{restaurant.priceRange}</p>
      </div>

      {/* Reservation Form */}
      <form onSubmit={handleReservationSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Reservation Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={reservationData.date}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium">
            Reservation Time
          </label>
          <input
            id="time"
            type="time"
            name="time"
            value={reservationData.time}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="partySize" className="block text-sm font-medium">
            Party Size
          </label>
          <input
            id="partySize"
            type="number"
            name="partySize"
            value={reservationData.partySize}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Confirm Reservation
        </button>
      </form>
    </div>
  );
}

export default CreateReservationPage;
