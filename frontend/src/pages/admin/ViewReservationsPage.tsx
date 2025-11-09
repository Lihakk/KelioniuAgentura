import React from 'react';

// Sample data - in a real app, this would come from your backend
const reservations = [
  { id: 'res1', trip: 'Kelionė į Graikiją', customer: 'Jonas Jonaitis', email: 'jonas@example.com' },
  { id: 'res2', trip: 'Savaitgalis Paryžiuje', customer: 'Petras Petraitis', email: 'petras@example.com' },
];

export const ViewReservationsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gautos Rezervacijos</h2>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kelionė</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Klientas</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">El. paštas</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{res.trip}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{res.customer}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{res.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
