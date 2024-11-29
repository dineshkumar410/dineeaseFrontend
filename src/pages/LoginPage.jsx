import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Once looged in save token and userId to local storage
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://dineease-91l7.onrender.com/api/users/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      navigate("/profile");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mt-4">
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white w-full mt-4 p-2 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
