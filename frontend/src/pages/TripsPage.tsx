import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Trip {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  duration: number;
  routeId: number;
  routeName?: string;
  mainImage?: string;
  availableSpots?: number;
  totalSpots?: number;
}

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useAuth();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://localhost:5050/api/admin/trips");
      console.log("Trips loaded:", response.data);

      setTrips(response.data);
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      setError("Nepavyko užkrauti kelionių. Bandykite dar kartą.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (trip: Trip) => {
    if (trip.mainImage) {
      return `http://localhost:5050${trip.mainImage}`;
    }
    return `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Kraunamos kelionės...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Klaida</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchTrips}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Bandyti dar kartą
          </button>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Visos Kelionės</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Kelionių nerasta
          </h3>
          <p className="text-gray-600">Šiuo metu nėra prieinamų kelionių.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Visos Kelionės</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
          >
            <Link to={`/trip/${trip.id}`}>
              <img
                src={getImageUrl(trip)}
                alt={trip.name}
                className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 
                    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop';
                }}
              />
            </Link>

            <div className="p-6">
              <div className="mb-4">
                <Link to={`/trip/${trip.id}`}>
                  <h2 className="font-bold text-xl hover:text-blue-600 transition-colors mb-2">
                    {trip.name}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {trip.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {trip.duration}{" "}
                    {trip.duration === 1
                      ? "diena"
                      : trip.duration < 10
                      ? "dienos"
                      : "dienų"}
                  </span>
                </div>
                <div className="font-bold text-blue-600 text-lg">
                  €{trip.price}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  to={`/trip/${trip.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  Daugiau info
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                 {role !== 'Administrator' && (
                <Link
                  to={`/rezervation/create`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Rezervuoti
                </Link>
              )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
