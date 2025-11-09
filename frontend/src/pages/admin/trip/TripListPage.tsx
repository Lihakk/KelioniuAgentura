import React from 'react';
import { Link } from 'react-router-dom';

const trips = [
  { id: 'greece', name: 'Kelionė į Graikiją' },
  { id: 'paris', name: 'Savaitgalis Paryžiuje'},
];

export const TripListPage: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Visos Kelionės</h2>
      <div className="space-y-3">
        {trips.map((t) => (
          <div key={t.id} className="flex items-center justify-between border rounded-md p-3">
            <div>
              <p className="font-semibold">{t.name}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/trip/${t.id}`} className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                Peržiūra (vieša)
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
