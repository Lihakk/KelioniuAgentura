import React from 'react';
import BackButton from '../../../components/BackButton';

export const RouteCreatePage: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Logic to save the new route data to the backend would go here
    alert('Naujas maršrutas išsaugotas!');
  };

  return (

    <div className="p-6 bg-white shadow rounded-lg">
      <BackButton />
      <h2 className="text-2xl font-bold mb-6">Sukurti Naują Maršrutą</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="routeName" className="block text-sm font-medium text-gray-700">Maršruto Pavadinimas</label>
          <input type="text" id="routeName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="routeDescription" className="block text-sm font-medium text-gray-700">Pradzios taškas</label>
          <textarea id="routeDescription" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div>
          <label htmlFor="waypoints" className="block text-sm font-medium text-gray-700">Pabaigos taškas</label>
          <textarea id="waypoints" rows={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700">
          Sukurti Maršrutą
        </button>
      </form>
    </div>
  );
};
