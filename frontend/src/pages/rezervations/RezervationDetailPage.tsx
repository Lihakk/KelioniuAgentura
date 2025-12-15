import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Reservation } from "../../types/Reservation";
import { GetReservationById } from "../../api/reservation/GetReservationById";
import { apiClient } from "../../api/AxiosInstace";

type Trip = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  mainImage?: string;
};

export const RezervationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationData = await GetReservationById(Number(id));
        setReservation(reservationData);

        const tripRes = await apiClient.get(
          `/api/admin/trips/${reservationData.reservationTrip.id}`
        );
        setTrip(tripRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500">Kraunama rezervacija...</p>
    );
  }

  if (!reservation || !trip) {
    return (
      <p className="text-center mt-12 text-gray-500">Rezervacija nerasta.</p>
    );
  }

  const isPaid = reservation.payment.status === "Paid";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getImageUrl = () =>
    trip.mainImage
      ? `http://localhost:5050${trip.mainImage}`
      : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200";

  const handlePayment = () => {
    navigate(`/payment/${reservation.id}`);
  };

  const handleEdit = () => {
    navigate(`/reservation/${reservation.id}/edit`);
  };

  const handleCancelReservation = async () => {
    try {
      await apiClient.delete(`/api/Reservation/Delete/${reservation.id}`);
      navigate("/reservationsList");
    } catch (err) {
      console.error("Nepavyko ištrinti rezervacijos", err);
      navigate(`/reservations/${id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">{trip.name}</h1>

      <img
        src={getImageUrl()}
        alt={trip.name}
        className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
      />

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Kelionės informacija</h2>

        <p className="text-gray-700 mb-4">{trip.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Pradžia:</span>{" "}
            {formatDate(trip.startDate)}
          </p>
          <p>
            <span className="font-semibold">Pabaiga:</span>{" "}
            {formatDate(trip.endDate)}
          </p>
          <p>
            <span className="font-semibold">Kaina asmeniui:</span> {trip.price}{" "}
            €
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Rezervacijos informacija</h2>

        <p>
          <span className="font-semibold">Keliautojų skaičius:</span>{" "}
          {reservation.travelers.length}
        </p>

        <p>
          <span className="font-semibold">Bendra suma:</span>{" "}
          {reservation.totalAmount} {reservation.payment.currency}
        </p>

        <p
          className={`font-semibold ${
            isPaid ? "text-green-600" : "text-orange-600"
          }`}
        >
          {isPaid ? "Apmokėta" : "Laukia apmokėjimo"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Keliautojai</h2>

        <ul className="divide-y">
          {reservation.travelers.map((t, index) => (
            <li key={t.id} className="py-4">
              <p className="font-medium">
                {index + 1}. {t.firstName} {t.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Gimimo data:</span>{" "}
                {formatDate(t.birthDate)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Dokumento nr.:</span>{" "}
                {t.documentNumber}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mt-6">
        <Link
          to="/reservationsList"
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Grįžti
        </Link>

        <div className="flex gap-2">
          {!isPaid && (
            <>
              <button
                onClick={handlePayment}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Sumokėti
              </button>

              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Redaguoti
              </button>
            </>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Atšaukti
          </button>
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
                className="px-4 py-2 rounded-md border border-gray-300"
              >
                Atšaukti
              </button>

              <button
                onClick={handleCancelReservation}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
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
