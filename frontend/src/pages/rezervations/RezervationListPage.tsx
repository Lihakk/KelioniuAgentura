import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GetAllReservations } from "../../api/reservation/GetAllReservations";
import type { Reservation } from "../../types/Reservation";

type Trip = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  mainImage?: string;
};

type TripMap = Record<number, Trip>;

export const RezervationListPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [trips, setTrips] = useState<TripMap>({});

  useEffect(() => {
    const loadData = async () => {
      const reservationsData = await GetAllReservations();
      setReservations(reservationsData);

      const tripIds = [
        ...new Set(reservationsData.map((r) => r.reservationTrip.id)),
      ];

      const tripMap: TripMap = {};

      await Promise.all(
        tripIds.map(async (id) => {
          const res = await axios.get(
            `http://localhost:5050/api/admin/trips/${id}`
          );

          tripMap[id] = {
            id: res.data.id,
            name: res.data.name,
            description: res.data.description,
            startDate: res.data.startDate,
            endDate: res.data.endDate,
            mainImage: res.data.mainImage,
          };
        })
      );

      setTrips(tripMap);
    };

    loadData();
  }, []);

  const getImageUrl = (tripId: number) => {
    const image = trips[tripId]?.mainImage;
    return image
      ? `http://localhost:5050${image}`
      : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Mano Rezervacijos</h1>

      {reservations.length === 0 ? (
        <p className="text-center text-gray-500">
          Kol kas neturite jokių rezervacijų.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {reservations.map((reservation) => {
            const trip = trips[reservation.reservationTrip.id];
            if (!trip) return null;

            return (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={getImageUrl(trip.id)}
                  alt={trip.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6 flex flex-col gap-3">
                  <h2 className="font-bold text-xl">{trip.name}</h2>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {trip.description}
                  </p>

                  <p>
                    <span className="font-semibold">Kelionės pradžia:</span>{" "}
                    {formatDate(trip.startDate)}
                  </p>

                  <p>
                    <span className="font-semibold">Kelionės pabaiga:</span>{" "}
                    {formatDate(trip.endDate)}
                  </p>

                  <p>
                    <span className="font-semibold">Keliautojų skaičius:</span>{" "}
                    {reservation.travelers.length}
                  </p>

                  <p>
                    <span className="font-semibold">Suma:</span>{" "}
                    {reservation.payment.amount} {reservation.payment.currency}
                  </p>

                  <p
                    className={`font-semibold ${
                      reservation.payment.status === "Paid"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {reservation.payment.status === "Paid"
                      ? "Apmokėta"
                      : "Laukia apmokėjimo"}
                  </p>

                  <Link
                    to={`/reservation/${reservation.id}`}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                  >
                    Peržiūrėti
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
