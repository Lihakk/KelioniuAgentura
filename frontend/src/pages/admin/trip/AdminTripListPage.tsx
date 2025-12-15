import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 

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
  availableSpots: number;
  totalSpots: number;
}

export const AdminTripListPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = "http://localhost:5050/api/admin/trips";
      console.log("🔍 Fetching trips from:", url);
      
      const response = await axios.get(url);
      
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      
      setTrips(response.data);
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      if (error.response) {
        setError(`Backend klaida: ${error.response.status} - ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        setError("Backend nepasiekiamas. Ar backend'as paleistas?");
      } else {
        setError(`Klaida: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (trip: Trip) => {
    setTripToDelete(trip);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;

    try {
      const url = `http://localhost:5050/api/admin/trips/${tripToDelete.id}`;
      console.log("Deleting trip:", url);
      
      await axios.delete(url);
      
      setTrips(trips.filter((t) => t.id !== tripToDelete.id));
      setDeleteModalOpen(false);
      setTripToDelete(null);
      alert("Kelionė ištrinta!");
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Nepavyko ištrinti kelionės: " + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kraunama...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Klaida užkraunant duomenis
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTrips}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Bandyti dar kartą
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded text-xs">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>• Backend URL: http://localhost:5050/api/admin/trips</p>
            <p>• Patikrinkite ar backend'as paleistas</p>
            <p>• Atidarykite Console (F12) daugiau info</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Kelionių Valdymas
              </h1>
              <p className="mt-2 text-gray-600">
                Rasta kelionių: {trips.length}
              </p>
            </div>
            <div className="flex space-x-3">
              
              <Link
                to="/admin/trip/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Pridėti Kelionę
              </Link>
            </div>
          </div>
        </div>

        {/* Trips List */}
        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
            <p className="text-gray-600 mb-4">
              Duomenų bazėje nėra kelionių arba backend negražina duomenų
            </p>
            <div className="space-y-2">
              <Link
                to="/admin/trip/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Pridėti Kelionę
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {trip.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{trip.description}</p>
                      {trip.routeName && (
                        <div className="flex items-center text-sm text-gray-500">
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
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                          </svg>
                          Maršrutas: {trip.routeName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Trukmė</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.duration} {trip.duration === 1 ? "diena" : trip.duration < 10 ? "dienos" : "dienų"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kaina</p>
                      <p className="text-sm font-semibold text-gray-900">€{trip.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Laisvos vietos</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.availableSpots} / {trip.totalSpots}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pradžia</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(trip.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pabaiga</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(trip.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/trip/${trip.id}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Peržiūrėti
                    </Link>
                    <Link
                      to={`/admin/trip/edit/${trip.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Redaguoti
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(trip)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Ištrinti
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && tripToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Patvirtinkite ištrynimą
              </h3>
              <p className="text-gray-600 mb-6">
                Ar tikrai norite ištrinti kelionę "{tripToDelete.name}"? Šis
                veiksmas negrįžtamas.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setTripToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Atšaukti
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Ištrinti
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};