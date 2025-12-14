import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../../components/BackButton';


const API_ENDPOINTS = {
  TRIPS: {
    GET_ONE: (id: number) => `http://localhost:5050/api/admin/trips/${id}`, 
    UPDATE: (id: number) => `http://localhost:5050/api/admin/trips/${id}`, 
    GET_ALL: 'http://localhost:5050/api/admin/trips', 
  },
};

interface Route {
  id: number;
  name: string;
}

interface TripData { 
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  routeId: number;
  totalSpots: number;
  availableSpots: number;
}

export const ModifyTripPage: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>(); 
  
  const [formData, setFormData] = useState<TripData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    price: 0,
    routeId: 0,
    totalSpots: 20,
    availableSpots:20
  });

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/Route');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Nepavyko užkrauti maršrutų');
    }
  };
  
  fetchRoutes();
  
  if (id) {
    // ... existing trip fetch logic
    const tripId = parseInt(id);
    if (!isNaN(tripId)) {
      fetchTrip(tripId);
    } else {
      setError('Neteisingas kelionės ID formatas.');
      setLoadingTrip(false);
    }
  }
}, [id]);

  const fetchTrip = async (tripId: number) => {
  try {
    setLoadingTrip(true);
    const url = API_ENDPOINTS.TRIPS.GET_ONE(tripId);
    const response = await axios.get(url);
    const trip = response.data;
    
    const startDate = new Date(trip.startDate).toISOString().split('T')[0];
    const endDate = new Date(trip.endDate).toISOString().split('T')[0];
    
    setFormData({
      name: trip.name,
      description: trip.description,
      startDate: startDate,
      endDate: endDate,
      price: parseFloat(trip.price) || 0,
      routeId: parseInt(trip.routeId) || 0,
      totalSpots: parseInt(trip.totalSpots) || 0,           // NAUJAS
      availableSpots: parseInt(trip.availableSpots) || 0,   // NAUJAS
    });
  } catch (error) {
    console.error('Klaida gaunant kelionės duomenis:', error);
    setError('Nepavyko užkrauti kelionės duomenų.');
  } finally {
    setLoadingTrip(false);
  }
};

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === 'price' || name === 'routeId' || name === 'totalSpots' || name === 'availableSpots'
      ? parseFloat(value) || 0 
      : value,
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  if (!id) {
    setError('Trūksta kelionės ID atnaujinimui.');
    setLoading(false);
    return;
  }

  try {
    const url = API_ENDPOINTS.TRIPS.UPDATE(parseInt(id));
    await axios.put(url, formData); 

    alert('Kelionė sėkmingai atnaujinta!');
    navigate(`/trip/${id}`);
  } catch (error: any) {
    console.error('Klaida atnaujinant kelionę:', error);
    setError(
      error.response?.data?.message ||
        'Nepavyko atnaujinti kelionės. Bandykite dar kartą.'
    );
  } finally {
    setLoading(false);
  }
};

  if (loadingTrip) {
    
    return (
        <div className="p-6">
          <BackButton />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Kraunami duomenys...</p>
            </div>
          </div>
        </div>
      );
  }

  
  return (
    <div className="p-6">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Redaguoti Kelionę</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Trip Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Kelionės Pavadinimas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Pvz: Kelionė į Graikiją"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Aprašymas <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Įveskite kelionės aprašymą..."
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Pradžios data <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Pabaigos data <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Price and Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Kaina (EUR) <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-gray-500">€</span>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="routeId" className="block text-sm font-medium text-gray-700">
              Maršrutas <span className="text-red-500">*</span>
            </label>
            <select
              id="routeId"
              name="routeId"
              required
              value={formData.routeId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0} disabled>Pasirinkite maršrutą</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label htmlFor="totalSpots" className="block text-sm font-medium text-gray-700">
      Viso vietų <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      id="totalSpots"
      name="totalSpots"
      required
      min="1"
      value={formData.totalSpots}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Pvz: 40"
    />
  </div>

  <div>
    <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700">
      Laisvos vietos <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      id="availableSpots"
      name="availableSpots"
      required
      min="0"
      max={formData.totalSpots}
      value={formData.availableSpots}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Pvz: 35"
    />
    <p className="mt-1 text-xs text-gray-500">
      Maksimaliai: {formData.totalSpots}
    </p>
  </div>
</div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            'Išsaugoti Pakeitimus'
          )}
        </button>
      </form>
    </div>
  );
};