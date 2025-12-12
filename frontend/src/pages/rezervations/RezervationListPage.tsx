import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetAllReservations } from "../../api/reservation/GetAllReservations";
import type { Reservation } from "../../types/Reservation";

export const RezervationListPage: React.FC = () => {
  useEffect(() => {
    const fetchReservations = async () => {
      const data = await GetAllReservations();
      console.log(data);
      setReservations(data);
    };
    fetchReservations();
  }, []);

  const [reservations, setReservations] = useState<Reservation[]>([]);
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
              key={reservation.reservationTrip.title}
              className="bg-white rounded-lg shadow-lg overflow-hidden group"
            >
              {/* <img
                src={reservation.imageUrl}
                alt={reservation.tripName}
                className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
              /> */}
              <div className="p-6 flex flex-col gap-3">
                <h2 className="font-bold text-xl">
                  {reservation.reservationTrip.description}
                </h2>
                <p>
                  <span className="font-semibold">Kelionės pradžia:</span>{" "}
                  {new Date(
                    reservation.reservationTrip.startDate
                  ).toLocaleDateString("lt", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <span className="font-semibold">Kelionės pabaiga:</span>{" "}
                  {new Date(
                    reservation.reservationTrip.endDate
                  ).toLocaleDateString("lt", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
                  {reservation.payment.status == "paid"
                    ? "Apmokėta"
                    : "Rezervuota"}
                </p>

                <Link
                  to={`/rezervation/${reservation.id}`}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                >
                  Peržiūrėti
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
