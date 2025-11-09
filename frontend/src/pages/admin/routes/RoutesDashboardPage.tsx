import React from 'react';
import { Link } from 'react-router-dom';

export const RoutesDashboardPage: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Maršrutų Valdymas</h2>
      {/* Updated to a 4-column grid for better layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="create" className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 transition-colors text-center font-semibold flex items-center justify-center">
          Sukurti Maršrutą
        </Link>
        <Link to="preview" className="bg-indigo-500 text-white p-6 rounded-lg hover:bg-indigo-600 transition-colors text-center font-semibold flex items-center justify-center">
          Maršruto Peržiūra
        </Link>
        <Link to="edit" className="bg-orange-500 text-white p-6 rounded-lg hover:bg-orange-600 transition-colors text-center font-semibold flex items-center justify-center">
          Maršruto Redagavimas
        </Link>
        <Link to="estimate-time" className="bg-cyan-500 text-white p-6 rounded-lg hover:bg-cyan-600 transition-colors text-center font-semibold flex items-center justify-center">
          Laiko Įvertinimas
        </Link>
      </div>
    </div>
  );
};
