import React from 'react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Prisijungimas</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Vartotojo vardas</label>
            <input type="text" id="username" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Slaptažodis</label>
            <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
            Prisijungti
          </button>
        </form>
      </div>
    </div>
  );
};
