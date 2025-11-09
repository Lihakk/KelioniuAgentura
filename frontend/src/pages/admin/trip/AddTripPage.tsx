import React from 'react';
import BackButton from '../../../components/BackButton';

export const AddTripPage: React.FC = () => {
  return (
    <div className="p-6">
      <BackButton/>
      <h2 className="text-2xl font-bold mb-4">Pridėti Naują Kelionę</h2>
      <form className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="tripName" className="block text-sm font-medium text-gray-700">Kelionės Pavadinimas</label>
          <input type="text" id="tripName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Paveikslėlio URL</label>
          <input type="text" id="imageUrl" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="route" className="block text-sm font-medium text-gray-700">Maršrutas</label>
          <textarea id="route" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Išsaugoti Kelionę
        </button>
      </form>
    </div>
  );
};
