import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Get user if logged in
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Clear cart state and persisted cart
    clearCart();
    navigate("/login");
  };

  return (
    <nav className="bg-transparent p-4 text-white backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🛍 E-Shop
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/cart" className="hover:text-gray-200 text-lg text-white">
            Cart
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold bg-white/10 text-white px-3 py-1 rounded-full shadow-sm">
                👤 {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

<button
  onClick={() => {
    document.documentElement.classList.toggle("dark");
  }}
  className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white transition"
>
  🌙 Toggle Dark Mode
</button>
