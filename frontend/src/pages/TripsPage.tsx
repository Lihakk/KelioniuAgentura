import React from 'react';
import { Link } from 'react-router-dom';

const trips = [
  { id: '1', destination: 'Kelionė į Graikiją', imageUrl: 'https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740' },
  { id: '2', destination: 'Savaitgalis Paryžiuje', imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774' },
];

export const TripsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Visos Kelionės</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <Link to={`/trip/${trip.id}`}>
              <img src={trip.imageUrl} alt={trip.destination} className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity" />
            </Link>
            <div className="p-6 flex justify-between items-center">
              <Link to={`/trip/${trip.id}`}>
                <h2 className="font-bold text-xl hover:text-blue-600">{trip.destination}</h2>
              </Link>
              <Link to={`/reservation/${trip.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap">
                Rezervuoti
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
