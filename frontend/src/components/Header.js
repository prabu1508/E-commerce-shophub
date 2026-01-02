import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "./Toast";

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount, clearCart } = useCart();
  const { showToast } = useToast();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const THRESHOLD = 20; // increase threshold for scroll shadow
    const onScroll = () => setScrolled(window.scrollY > THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      setSearchParams({ search: q.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleLogout = () => {
    logout();
    // Clear local cart when user logs out
    clearCart();
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  return (
    <header className={`sticky top-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/10 transition-shadow duration-300 ${scrolled ? 'shadow-2xl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            🛍️ ShopHub
          </Link>

          <form onSubmit={onSearch} className="flex-1 max-w-2xl mx-4">
            <div className="flex">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-l-lg bg-white/10 text-white placeholder-white/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg font-semibold transition"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative px-4 py-2 text-white hover:text-blue-200 transition font-semibold"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="px-4 py-2 text-white transition font-semibold">
                  👤 {user.name}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white/5 rounded-lg shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-sm">
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-white/90 border-b border-white/10">
                      {user.email}
                    </div>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/5"
                    >
                      My Orders
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-white hover:bg-white/5"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-blue-200 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
