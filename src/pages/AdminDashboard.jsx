import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation

function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createRestaurantModal, setCreateRestaurantModal] = useState(false);
  const [updateRestaurantModal, setUpdateRestaurantModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    cuisine: "",
    priceRange: "",
    location: "",
  });
  const navigate = useNavigate();

  // Fetch the data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch restaurants
        const restaurantResponse = await axios.get(
          "https://dineease-91l7.onrender.com/api/restaurants/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRestaurants(restaurantResponse.data);

        // Fetch reviews
        const reviewResponse = await axios.get(
          "https://dineease-91l7.onrender.com/api/reviews/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReviews(reviewResponse.data);

        // Fetch reservations
        const reservationResponse = await axios.get(
          "https://dineease-91l7.onrender.com/api/reservations/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReservations(reservationResponse.data);

        // Set loading to false after fetching data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle restaurant listing update
  const handleUpdateRestaurant = async (restaurantId, updatedData) => {
    try {
      await axios.patch(
        `https://dineease-91l7.onrender.com/api/restaurants/${restaurantId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Set the updated data to the correct restaurant
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? { ...restaurant, ...updatedData }
            : restaurant
        )
      );
      alert("Restaurant updated successfully!");
    } catch (err) {
      alert("Error updating restaurant");
      console.error("Error updating restaurant:", err);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `https://dineease-91l7.onrender.com/api/admin/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Removing the deleted review from the list of reviews
      setReviews(reviews.filter((review) => review._id !== reviewId));
      alert("Review deleted successfully!");
    } catch (err) {
      alert("Error deleting review");
      console.error("Error deleting review:", err);
    }
  };

  // Handle reservation deletion
  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(
        `https://dineease-91l7.onrender.com/api/admin/reservations/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Removing the deleted reservation from the list of reviews
      setReservations(
        reservations.filter((reservation) => reservation._id !== reservationId)
      );
      alert("Reservation deleted successfully!");
    } catch (err) {
      alert("Error deleting reservation");
      console.error("Error deleting reservation:", err);
    }
  };

  // Handle restaurant form submission (for both create and update)
  const handleRestaurantFormSubmit = async (e) => {
    e.preventDefault();

    // Check if we are updating or creating a new restaurant
    if (selectedRestaurant) {
      // Update existing restaurant
      await handleUpdateRestaurant(selectedRestaurant._id, restaurantForm);
    } else {
      // Create new restaurant
      try {
        await axios.post(
          "https://dineease-91l7.onrender.com/api/restaurants/",
          restaurantForm,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Add new restaurant to the list
        setRestaurants([...restaurants, restaurantForm]);
        alert("Restaurant created successfully!");
      } catch (error) {
        console.error("Error creating restaurant:", error);
      }
    }

    // Reset the form and close modal
    setRestaurantForm({
      name: "",
      cuisine: "",
      priceRange: "",
      location: "",
    });
    setCreateRestaurantModal(false);
    setUpdateRestaurantModal(false);
    setSelectedRestaurant(null);
  };

  // Open modal for creating restaurant
  const openCreateRestaurantModal = () => {
    setCreateRestaurantModal(true);
    setRestaurantForm({
      name: "",
      cuisine: "",
      priceRange: "",
      location: "",
    });
    setSelectedRestaurant(null);
  };

  // Open modal for updating restaurant
  const openUpdateRestaurantModal = (restaurant) => {
    setUpdateRestaurantModal(true);
    setRestaurantForm({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      priceRange: restaurant.priceRange,
      location: restaurant.location,
    });
    setSelectedRestaurant(restaurant);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Create Restaurant Button */}
      <button
        onClick={openCreateRestaurantModal}
        className="bg-green-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Create Restaurant
      </button>

      {/* Update Restaurants Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manage Restaurants</h2>
        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="border p-4 rounded-md">
              <h3 className="font-semibold">{restaurant.name}</h3>
              <p>{restaurant.cuisine}</p>
              <p>{restaurant.priceRange}</p>
              <button
                onClick={() => openUpdateRestaurantModal(restaurant)}
                className="bg-blue-500 text-white py-1 px-4 rounded-md mt-2"
              >
                Update Restaurant
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manage Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded-md">
              <p className="font-semibold">{review.restaurant.name}</p>
              <p>
                {review.comment} -{review.user.name}
              </p>
              <button
                onClick={() => handleDeleteReview(review._id)}
                className="bg-red-500 text-white py-1 px-4 rounded-md mt-2"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reservations Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manage Reservations</h2>
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="border p-4 rounded-md">
              <p className="font-semibold">{reservation.restaurant.name}</p>
              <p className="font-semibold">{reservation.user.name}</p>
              <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
              <p>Time: {reservation.time}</p>
              <p>Party Size: {reservation.partySize}</p>
              <button
                onClick={() => handleDeleteReservation(reservation._id)}
                className="bg-red-500 text-white py-1 px-4 rounded-md mt-2"
              >
                Cancel Reservation
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Update Restaurant Modal */}
      {(createRestaurantModal || updateRestaurantModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">
              {selectedRestaurant ? "Update Restaurant" : "Create Restaurant"}
            </h2>
            <form onSubmit={handleRestaurantFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Restaurant Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={restaurantForm.name}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cuisine" className="block text-sm font-medium">
                  Cuisine
                </label>
                <input
                  id="cuisine"
                  type="text"
                  value={restaurantForm.cuisine}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      cuisine: e.target.value,
                    })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="priceRange"
                  className="block text-sm font-medium"
                >
                  Price Range
                </label>
                <input
                  id="priceRange"
                  type="text"
                  value={restaurantForm.priceRange}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      priceRange: e.target.value,
                    })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={restaurantForm.location}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      location: e.target.value,
                    })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {selectedRestaurant ? "Update" : "Create"} Restaurant
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreateRestaurantModal(false);
                  setUpdateRestaurantModal(false);
                }}
                className="ml-2 bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
