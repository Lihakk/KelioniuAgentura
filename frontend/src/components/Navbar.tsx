// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const MenuLinks = () => {
    // ---------------- Administrator ----------------
    if (role === "Administrator") {
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
            Administracija
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

    // ---------------- Employee ----------------
    if (role === "Employee") {
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
            to="/employee"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Darbuotojo sistema
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

    // ---------------- Client ----------------
    if (role === "Client") {
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
            to="/client"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Mano sistemos
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

    // ---------------- Guest ----------------
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
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Kelionių Agentūra
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <MenuLinks />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
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

      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          <MenuLinks />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
