import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useChat } from "../context/ChatContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { unreadTotal } = useChat();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  /* Close dropdown if clicked outside */
  useEffect(() => {
    const clickHandler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
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
          className="font-bold text-2xl tracking-wide text-blue-700 dark:text-blue-400 hover:opacity-80"
        >
          Lost & Found
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
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

          {/* Chats + unread badge */}
          <Link to="/chats" className="relative navbar-link">
            Chats
            {unreadTotal > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadTotal}
              </span>
            )}
          </Link>

          <Link to="/about" className="navbar-link">
            About
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
          >
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5 text-gray-800" />
            ) : (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {/* User menu (desktop) */}
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                Welcome, {user.name.split(" ")[0]}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
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
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md shadow-lg p-2 animate-fadeIn">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="btn-auth">
                Login
              </Link>
              <Link to="/register" className="btn-auth">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-900 dark:text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 px-6 py-4 space-y-4 animate-fadeIn">
          <Link
            to="/"
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/lost"
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Lost
          </Link>
          <Link
            to="/found"
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Found
          </Link>
          <Link
            to="/upload"
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Upload
          </Link>
          <Link
            to="/myitems"
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            My Items
          </Link>

          <Link
            to="/chats"
            className="relative mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Chats
            {unreadTotal > 0 && (
              <span className="absolute ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadTotal}
              </span>
            )}
          </Link>

          <Link
            to="/about"
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="btn-auth block"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-auth block"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
