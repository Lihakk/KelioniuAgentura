import React from 'react';
import BackButton from '../../../components/BackButton';

const trips = [
  { id: '1', destination: 'Kelionė į Graikiją' },
  { id: '2', destination: 'Savaitgalis Paryžiuje' },
];

export const ModifyTripsPage: React.FC = () => {
  return (
    <div className="p-6">
      <BackButton/>
      <h2 className="text-2xl font-bold mb-4">Redaguoti Keliones</h2>
      <div className="bg-white shadow rounded-lg p-4 space-y-3">
        {trips.map((trip) => (
          <div key={trip.id} className="flex justify-between items-center p-3 border rounded-md">
            <span className="font-semibold">{trip.destination}</span>
            <div className="space-x-2">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">Redaguoti</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Ištrinti</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
