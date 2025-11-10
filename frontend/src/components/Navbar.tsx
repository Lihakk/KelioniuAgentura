// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const MenuLinks = () => {
    if (role === "admin") {
      return (
        <>
          <Link
            to="/"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Pagrindinis
          </Link>
          <Link
            to="/trips"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Kelionės
          </Link>
          <Link
            to="/admin"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Admin
          </Link>
          <Link
            to="/profile"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Profilis
          </Link>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Atsijungti
          </button>
        </>
      );
    }
    if (role === "user") {
      return (
        <>
          <Link
            to="/"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Pagrindinis
          </Link>
          <Link
            to="/trips"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Kelionės
          </Link>
          <Link
            to="/reservation"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Rezervacijos
          </Link>
          <Link
            to="/profile"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Profilis
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Atsijungti
          </button>
        </>
      );
    }
    return (
      <>
        <Link
          to="/"
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Pagrindinis
        </Link>
        <Link
          to="/trips"
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Kelionės
        </Link>
        <Link
          to="/login"
          className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Prisijungti
        </Link>
        <Link
          to="/signup"
          className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          Registruotis
        </Link>
      </>
    );
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Kelionių Agentūra
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <MenuLinks />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          <MenuLinks />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
