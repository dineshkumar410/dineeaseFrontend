import React, { useState } from "react";

const ReviewCard = ({ review, onEdit, onDelete }) => {
  // Getting userId stored in localStorage
  const userId = localStorage.getItem("userId");

  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center">
        <div className="font-semibold text-lg">{review.user.name}</div>
        <div className="ml-2 text-yellow-500">
          {/* Generating coloured star and empty star coresponding to the user rating */}
          {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
        </div>
      </div>
      <p>{review.comment}</p>
      {/* Only show Edit and Delete button for the logged in users comment */}
      {userId === review.user._id && (
        <div className="flex space-x-2 mt-2">
          <button
            className="bg-yellow-500 text-white py-1 px-3 rounded-md"
            onClick={() => onEdit(review)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md"
            onClick={() => onDelete(review._id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
