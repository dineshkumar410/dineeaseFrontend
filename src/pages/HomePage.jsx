import React, { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

function HomePage() {
  const [restaurants, setRestaurants] = useState([]);

  // Fetch all the restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "https://dineease-91l7.onrender.com/api/restaurants/"
        );
        console.log(response.data);
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Featured Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
