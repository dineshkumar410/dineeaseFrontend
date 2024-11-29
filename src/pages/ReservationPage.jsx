import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editReservation, setEditReservation] = useState({});
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newPartySize, setNewPartySize] = useState("");

  // Fetches the reservations of current logged in user
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "https://dineease-91l7.onrender.com/api/reservations/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  // Deletes a reservation
  const handleCancel = async (id) => {
    try {
      await axios.delete(
        `https://dineease-91l7.onrender.com/api/reservations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReservations(reservations.filter((res) => res._id !== id));
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  // Edits a reservation
  const handleEdit = (reservation) => {
    setIsEditing(true);
    setEditReservation(reservation);
    setNewDate(new Date(reservation.date).toLocaleDateString());
    setNewTime(reservation.time);
    setNewPartySize(reservation.partySize);
  };

  // Updates a reservation
  const handleUpdate = async () => {
    try {
      const updatedReservation = {
        date: new Date(newDate).toISOString(),
        time: newTime,
        partySize: newPartySize,
      };

      await axios.patch(
        `https://dineease-91l7.onrender.com/api/reservations/${editReservation._id}`,
        updatedReservation,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReservations(
        reservations.map((res) =>
          res._id === editReservation._id
            ? { ...res, ...updatedReservation }
            : res
        )
      );
      setIsEditing(false);
      setEditReservation({});
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const isLoggedIn = localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Please log in to view your reservations
          </h2>
          <Link
            to="/login"
            className="text-blue-500 hover:underline mt-2 block"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Reservations</h1>
      <div className="grid gap-4 mt-4">
        {reservations.map((reservation) => (
          <div key={reservation._id} className="border rounded-md p-4">
            <h2 className="font-semibold">{reservation.restaurant.name}</h2>
            <h4 className="font-semibold">{reservation.user.name}</h4>
            <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
            <p>Time: {reservation.time}</p>
            <p>Party Size: {reservation.partySize}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(reservation)}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Edit Reservation
              </button>
              <button
                onClick={() => handleCancel(reservation._id)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Reservation</h2>
            <div className="mb-4">
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Party Size</label>
              <input
                type="number"
                value={newPartySize}
                onChange={(e) => setNewPartySize(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div className="space-x-2">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white p-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationPage;
