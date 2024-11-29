import React, { useState } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

// Fetch the restaurant satisfied the criteria
function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    cuisine: "",
    priceRange: "",
    location: "",
  });
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "https://dineease-91l7.onrender.com/api/search/",
        {
          params: searchParams,
        }
      );
      setResults(response.data.restaurants);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Search Restaurants</h1>
      <form onSubmit={handleSearch} className="grid gap-4 mt-4">
        <input
          type="text"
          placeholder="Cuisine"
          value={searchParams.cuisine}
          onChange={(e) =>
            setSearchParams({ ...searchParams, cuisine: e.target.value })
          }
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Location"
          value={searchParams.location}
          onChange={(e) =>
            setSearchParams({ ...searchParams, location: e.target.value })
          }
          className="border p-2 rounded-md"
        />
        <select
          value={searchParams.priceRange}
          onChange={(e) =>
            setSearchParams({ ...searchParams, priceRange: e.target.value })
          }
          className="border p-2 rounded-md"
        >
          <option value="">Select Price Range</option>
          <option value="$">$</option>
          <option value="$$">$$</option>
          <option value="$$$">$$$</option>
          <option value="$$$$">$$$$</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {results.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
