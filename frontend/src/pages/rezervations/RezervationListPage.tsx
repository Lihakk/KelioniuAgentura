import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Reservation = {
  id: number;
  tripName: string;
  date: string;
  people: number;
  imageUrl: string;
  isPaid: boolean;
};

const initialReservations: Reservation[] = [
  {
    id: 1,
    tripName: "Kelionė į Graikiją",
    date: "2025-06-15",
    people: 2,
    imageUrl: "https://images.unsplash.com/photo-1580579628597-4229342c5c99",
    isPaid: false,
  },
  {
    id: 2,
    tripName: "Savaitgalis Paryžiuje",
    date: "2025-07-03",
    people: 4,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760c0337",
    isPaid: true,
  },
];

export const RezervationListPage: React.FC = () => {
  const [reservations, setReservations] = useState(initialReservations);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

  const confirmCancel = (id: number) => {
    setSelectedReservationId(id);
    setModalOpen(true);
  };

  const handleCancel = () => {
    if (selectedReservationId !== null) {
      setReservations((prev) =>
        prev.filter((r) => r.id !== selectedReservationId)
      );
    }
    setModalOpen(false);
    setSelectedReservationId(null);
  };

  const handlePayment = (id: number) => {
    navigate(`/payment/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Mano Rezervacijos</h1>
      {reservations.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Kol kas neturite jokių rezervacijų.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden group"
            >
              <img
                src={reservation.imageUrl}
                alt={reservation.tripName}
                className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="p-6 flex flex-col gap-3">
                <h2 className="font-bold text-xl">{reservation.tripName}</h2>
                <p className="text-gray-600">
                  <span className="font-semibold">Data:</span>{" "}
                  {reservation.date}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Keliautojų skaičius:</span>{" "}
                  {reservation.people}
                </p>
                <p
                  className={`font-semibold ${
                    reservation.isPaid ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {reservation.isPaid ? "Apmokėta" : "Rezervuota"}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/trip/${reservation.id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Peržiūrėti kelionę
                  </Link>
                  <div className="flex gap-2">
                    {!reservation.isPaid && (
                      <button
                        onClick={() => handlePayment(reservation.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Sumokėti
                      </button>
                    )}
                    <button
                      onClick={() => confirmCancel(reservation.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Atšaukti
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Patvirtinimas</h2>
            <p className="mb-6">Ar tikrai norite atšaukti šią rezervaciją?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Atšaukti
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Patvirtinti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
