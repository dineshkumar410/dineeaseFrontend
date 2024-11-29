import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDetails from "./pages/RestaurantDetails";
import SearchPage from "./pages/SearchPage";
import ReservationPage from "./pages/ReservationPage";
import CreateReservationPage from "./pages/CreateReservationPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reservations" element={<ReservationPage />} />
          <Route
            path="/reservations/:restaurantId"
            element={<CreateReservationPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
