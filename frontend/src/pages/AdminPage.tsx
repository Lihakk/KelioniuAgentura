import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <Link to="reservations" className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold">Peržiūrėti Rezervacijas</h3>
      </Link>
      <Link to="add-trip" className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition-colors flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold">Pridėti Kelionę</h3>
      </Link>
      <Link to="modify-trips" className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold">Redaguoti Keliones</h3>
      </Link>
      <Link to="estimate-time" className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 transition-colors flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold">Įvertinti Laiką</h3>
      </Link>
    </div>
  );
};

export const AdminPage: React.FC = () => {
  const location = useLocation();
  // Show dashboard only on the main /admin route
  const isDashboard = location.pathname === '/admin';

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8">Administratoriaus Panelė</h1>
      {isDashboard && <AdminDashboard />}
      <div className="mt-4">
        <Outlet /> {/* This is where the child routes will be rendered */}
      </div>
    </div>
  );
};
