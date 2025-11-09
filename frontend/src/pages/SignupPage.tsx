// src/pages/SignupPage.tsx
import React from 'react';
import BackButton from '../components/BackButton';

export const SignupPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sukurti paskyrą</h1>
          <BackButton />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vardas</label>
            <input id="name" type="text" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">El. paštas</label>
            <input id="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Slaptažodis</label>
            <input id="password" type="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Pakartokite slaptažodį</label>
            <input id="confirm" type="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Registruotis
          </button>
        </form>
      </div>
    </div>
  );
};
