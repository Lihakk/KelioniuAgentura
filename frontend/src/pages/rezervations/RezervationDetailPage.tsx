import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Reservation } from "../../types/Reservation";
import { GetReservationById } from "../../api/reservation/GetReservationById";

export const RezervationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const data = await GetReservationById(id ? Number(id) : 0);
        setReservation(data);
      } catch {
        console.error("Could not fetch reservation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500">Kraunama rezervacija...</p>
    );
  }

  if (!reservation) {
    return (
      <p className="text-center mt-12 text-gray-500">Rezervacija nerasta.</p>
    );
  }

  const handleCancel = () => {
    setModalOpen(false);
    navigate("/reservationsList");
  };

  const handlePayment = () => {
    navigate(`/payment/${reservation.id}`);
  };

  const handleEdit = () => {
    navigate(`/reservation/${reservation.id}/edit`);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        {reservation.reservationTrip.title}
      </h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* <img
          src={reservation.imageUrl}
          alt={reservation.tripName}
          className="w-full h-64 object-cover"
        /> */}
        <div className="p-6 flex flex-col gap-4">
          <p>
            <span className="font-semibold">Kelionės pradžia:</span>{" "}
            {new Date(reservation.reservationTrip.startDate).toLocaleDateString(
              "lt",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
          <p>
            <span className="font-semibold">Kelionės pabaiga:</span>{" "}
            {new Date(reservation.reservationTrip.endDate).toLocaleDateString(
              "lt",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
          <p>
            <span className="font-semibold">Keliautojų skaičius:</span>{" "}
            {reservation.travelers.length}
          </p>
          <p
            className={`font-semibold ${
              reservation.payment.status == "paid"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {reservation.payment.status == "paid" ? "Apmokėta" : "Rezervuota"}
          </p>

          <div className="flex justify-between mt-6">
            <Link
              to="/reservationsList"
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Grįžti
            </Link>
            <div className="flex gap-2">
              {reservation.status != "paid" && (
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
