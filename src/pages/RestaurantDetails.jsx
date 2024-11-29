import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReviewCard from "../components/ReviewCard";

function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 1,
    comment: "",
  });
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch restaurant details
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `https://dineease-91l7.onrender.com/api/restaurants/${id}`
        );
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    // Fetch reviews for this restaurant
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://dineease-91l7.onrender.com/api/reviews/${id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchRestaurant();
    fetchReviews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  // Navigate to the reservation page
  const handleReserve = () => {
    navigate(`/reservations/${restaurant._id}`);
  };

  // Submits a new review or edits the existing review
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to submit a review");
      setNewReview({ rating: 1, comment: "" });
      return;
    }

    const reviewData = {
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      if (editMode) {
        // Update review
        const response = await axios.patch(
          `https://dineease-91l7.onrender.com/api/reviews/${editMode}`,
          reviewData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r._id === editMode ? response.data.review : r
          )
        );
        alert("Review updated successfully!");
      } else {
        // Create new review
        const response = await axios.post(
          `https://dineease-91l7.onrender.com/api/reviews/${id}`,
          reviewData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews((prevReviews) => [response.data.review, ...prevReviews]);
        alert("Review submitted successfully!");
      }

      setNewReview({ rating: 1, comment: "" });
      // Exit edit mode
      setEditMode(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleEditReview = (review) => {
    setNewReview({
      rating: review.rating,
      comment: review.comment,
    });
    // Set edit mode with review ID
    setEditMode(review._id);
  };

  const handleDeleteReview = async (reviewId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://dineease-91l7.onrender.com/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReviews((prevReviews) =>
        prevReviews.filter((r) => r._id !== reviewId)
      );
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{restaurant.name}</h1>
      <p className="text-gray-500">{restaurant.cuisine}</p>
      <p className="text-gray-600">{restaurant.location}</p>
      <div className="flex justify-between">
        {restaurant.address && (
          <p className="text-gray-600">Address: {restaurant.address}</p>
        )}
        {restaurant?.contactDetails?.phone && (
          <p className="text-gray-600">
            Phone: {restaurant.contactDetails.phone}
          </p>
        )}
        {restaurant?.contactDetails?.email && (
          <p className="text-gray-600">
            Email: {restaurant.contactDetails.email}
          </p>
        )}
      </div>
      <img
        src={restaurant.photos[0] || "./../assets/generic_restaurant.jpg"}
        alt={restaurant.name}
        className="w-full h-60 object-cover mt-4 rounded-md"
      />
      <h2 className="text-2xl font-semibold mt-6">Menu</h2>
      <ul className="list-disc ml-6">
        {restaurant.menu.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-6">
        {editMode ? "Edit Review" : "Write a Review"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={newReview.rating}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={newReview.comment}
            onChange={handleChange}
            rows="4"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Should be a minimum of 10 characters"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          {editMode ? "Update Review" : "Submit Review"}
        </button>
      </form>
      <button
        onClick={handleReserve}
        className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Make a Reservation
      </button>
    </div>
  );
}

export default RestaurantDetails;
