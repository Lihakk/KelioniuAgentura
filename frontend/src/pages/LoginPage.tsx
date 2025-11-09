// src/pages/LoginPage.tsx (append footer and optional BackButton at top)
import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: auth then navigate
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Prisijungimas</h2>
          <BackButton />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vartotojo vardas</label>
            <input type="text" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slaptažodis</label>
            <input type="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Prisijungti
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Neturite paskyros?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Registruokitės
          </Link>
        </div>
      </div>
    </div>
  );
};
