import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

type Reservation = {
  id: number;
  tripName: string;
  date: string;
  people: number;
  imageUrl: string;
  isPaid: boolean;
};

// Sample data (replace with API or state)
const reservationsData: Reservation[] = [
  {
    id: 1,
    tripName: "Kelionė į Graikiją",
    date: "2025-06-15",
    people: 2,
    imageUrl: "https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    isPaid: false,
  },
  {
    id: 2,
    tripName: "Savaitgalis Paryžiuje",
    date: "2025-07-03",
    people: 4,
    imageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    isPaid: true,
  },
];

export const RezervationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(reservationsData);
  const [modalOpen, setModalOpen] = useState(false);

  const reservation = reservations.find((r) => r.id === Number(id));
  if (!reservation)
    return (
      <p className="text-center mt-12 text-gray-500">Rezervacija nerasta.</p>
    );

  const handleCancel = () => {
    setReservations((prev) => prev.filter((r) => r.id !== reservation.id));
    setModalOpen(false);
    navigate("/rezervacijos"); // back to list
  };

  const handlePayment = () => {
    navigate(`/payment/${reservation.id}`);
  };

  const handleEdit = () => {
    navigate(`/rezervation/${reservation.id}/edit`);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        {reservation.tripName}
      </h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={reservation.imageUrl}
          alt={reservation.tripName}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 flex flex-col gap-4">
          <p>
            <span className="font-semibold">Data:</span> {reservation.date}
          </p>
          <p>
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

          <div className="flex justify-between mt-6">
            <Link
              to="/rezervacijos"
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Grįžti
            </Link>
            <div className="flex gap-2">
              {!reservation.isPaid && (
                <button
                  onClick={handlePayment}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Sumokėti
                </button>
              )}
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
              >
                Redaguoti
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Atšaukti
              </button>
            </div>
          </div>
        </div>
      </div>

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
