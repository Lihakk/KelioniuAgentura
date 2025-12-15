import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserPreferencesPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: 0,
    budgetMin: 500,
    budgetMax: 2000,
    minDuration: 5,
    maxDuration: 14,
    travelDateStart: '',
    travelDateEnd: '',
    preferredDestinations: [] as string[],
    travelStyle: [] as string[],
    activityLevel: 3,
    groupSize: 'any',
  });

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/User/Me', {
          withCredentials: true,
        });

        const userId = response.data.id;
        setFormData((prev) => ({ ...prev, userId }));

        loadExistingPreferences(userId);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Nepavyko gauti vartotojo duomenų. Prašome prisijungti.');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const loadExistingPreferences = async (userId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/recommendations/preferences/${userId}`
      );

      if (response.data) {
        setFormData({
          userId: userId,
          budgetMin: response.data.budgetMin || 500,
          budgetMax: response.data.budgetMax || 2000,
          minDuration: response.data.minDuration || 5,
          maxDuration: response.data.maxDuration || 14,
          travelDateStart: response.data.travelDateStart
            ? new Date(response.data.travelDateStart).toISOString().split('T')[0]
            : '',
          travelDateEnd: response.data.travelDateEnd
            ? new Date(response.data.travelDateEnd).toISOString().split('T')[0]
            : '',
          preferredDestinations: response.data.preferredDestinations || [],
          travelStyle: response.data.travelStyle || [],
          activityLevel: response.data.activityLevel || 3,
          groupSize: response.data.groupSize || 'any',
        });
      }
    } catch (err) {
      console.log('No existing preferences found');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      setError('Vartotojas nerastas. Prašome prisijungti.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        'http://localhost:5050/api/recommendations/preferences',
        formData
      );

      navigate('/');
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      setError(
        err.response?.data?.message ||
          'Klaida išsaugant preferencijas. Bandykite dar kartą.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationChange = (destination: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDestinations: prev.preferredDestinations.includes(destination)
        ? prev.preferredDestinations.filter((d) => d !== destination)
        : [...prev.preferredDestinations, destination],
    }));
  };

  const handleStyleChange = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter((s) => s !== style)
        : [...prev.travelStyle, style],
    }));
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mano Kelionių Preferencijos</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Budget */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Biudžetas (EUR)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimumas
              </label>
              <input
                type="number"
                min="0"
                value={formData.budgetMin}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMin: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimumas
              </label>
              <input
                type="number"
                min="0"
                value={formData.budgetMax}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMax: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Trukmė (dienomis)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimumas
              </label>
              <input
                type="number"
                min="1"
                value={formData.minDuration}
                onChange={(e) =>
                  setFormData({ ...formData, minDuration: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimumas
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxDuration}
                onChange={(e) =>
                  setFormData({ ...formData, maxDuration: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Travel Dates */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Kelionės Datos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuo
              </label>
              <input
                type="date"
                value={formData.travelDateStart}
                onChange={(e) =>
                  setFormData({ ...formData, travelDateStart: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Iki
              </label>
              <input
                type="date"
                value={formData.travelDateEnd}
                onChange={(e) =>
                  setFormData({ ...formData, travelDateEnd: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Pageidaujamos Kryptys</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'graikija', label: 'Graikija' },
              { value: 'ispanija', label: 'Ispanija' },
              { value: 'italija', label: 'Italija' },
              { value: 'prancūzija', label: 'Prancūzija' },
              { value: 'portugalija', label: 'Portugalija' },
              { value: 'kroatija', label: 'Kroatija' },
              { value: 'lietuva', label: 'Lietuva' },
              { value: 'latvija', label: 'Latvija' },
              { value: 'estija', label: 'Estija' },
              { value: 'vokietija', label: 'Vokietija' },
              { value: 'lenkija', label: 'Lenkija' },
              { value: 'čekija', label: 'Čekija' },
              { value: 'austrija', label: 'Austrija' },
              { value: 'vengrija', label: 'Vengrija' },
              { value: 'baltijos', label: 'Baltijos šalys' },
            ].map((dest) => (
              <label key={dest.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferredDestinations.includes(dest.value)}
                  onChange={() => handleDestinationChange(dest.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span>{dest.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Kelionės Stilius</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'nuotykiai', label: 'Nuotykiai' },
              { value: 'atsipalaidavimas', label: 'Atsipalaidavimas' },
              { value: 'kultūra', label: 'Kultūra' },
              { value: 'gamta', label: 'Gamta' },
              { value: 'miestas', label: 'Miestas' },
            ].map((style) => (
              <label key={style.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.travelStyle.includes(style.value)}
                  onChange={() => handleStyleChange(style.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span>{style.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Aktyvumo Lygis: {formData.activityLevel}/5
          </h2>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.activityLevel}
            onChange={(e) =>
              setFormData({ ...formData, activityLevel: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Ramus</span>
            <span>Vidutinis</span>
            <span>Aktyvus</span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Grupės Dydis</h2>
          <select
            value={formData.groupSize}
            onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Bet koks</option>
            <option value="solo">Solo</option>
            <option value="pora">Pora</option>
            <option value="šeima">Šeima</option>
            <option value="grupė">Grupė</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saugoma...
            </>
          ) : (
            'Gauti Rekomendacijas'
          )}
        </button>
      </form>
    </div>
  );
};