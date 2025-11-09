import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ReservationPage: React.FC = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Cia bus form data to your backend
    console.log(`Submitting reservation for trip: ${tripId}`);
    
    // Redirect to the checkout page
    navigate('/checkout');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Kelionės Rezervacija</h1>
      <p className="text-center text-gray-600 mb-6">Jūs rezervuojate kelionę: <span className="font-semibold">{tripId}</span></p>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vardas</label>
          <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">El. paštas</label>
          <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Tęsti į Apmokėjimą
        </button>
      </form>
    </div>
  );
};
