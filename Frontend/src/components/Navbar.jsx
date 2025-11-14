import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-2xl tracking-wide text-blue-700 dark:text-blue-400 hover:opacity-80 transition"
        >
          Lost & Found
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center justify-center gap-6 text-sm sm:text-base">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/lost" className="navbar-link">
            Lost
          </Link>
          <Link to="/found" className="navbar-link">
            Found
          </Link>
          <Link to="/upload" className="navbar-link">
            Upload
          </Link>
          <Link to="/myitems" className="navbar-link">
            My Items
          </Link>
          <Link to="/about" className="navbar-link">
            About
          </Link>
        </div>

        {/* Right side: Dark mode + User dropdown */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5 text-gray-800" />
            ) : (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            )}
          </button>

          {/* User dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Welcome, {user.name.split(" ")[0]}
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md shadow-lg p-2 animate-fadeIn z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 00-3 3v10a3 3 0 003 3h2"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-auth">
                Login
              </Link>
              <Link to="/register" className="btn-auth">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
