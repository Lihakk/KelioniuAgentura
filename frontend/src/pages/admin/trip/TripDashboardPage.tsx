import React from 'react';
import { Link } from 'react-router-dom';

export const TripDashboardPage: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Kelionių Valdymas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="create" className="bg-green-500 text-white p-6 rounded-lg text-center font-semibold hover:bg-green-600 transition-colors">
          Pridėti Kelionę
        </Link>
        <Link to="list" className="bg-blue-500 text-white p-6 rounded-lg text-center font-semibold hover:bg-blue-600 transition-colors">
          Peržiūrėti Keliones
        </Link>
        <Link to="edit/" className="bg-yellow-500 text-white p-6 rounded-lg text-center font-semibold hover:bg-yellow-600 transition-colors">
          Redaguoti Kelionę
        </Link>
      </div>
    </div>
  );
};
