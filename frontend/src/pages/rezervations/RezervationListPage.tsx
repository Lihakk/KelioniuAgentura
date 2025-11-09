import React, { useState } from "react";
import { Link } from "react-router-dom";

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
                <p>
                  <span className="font-semibold">Data:</span>{" "}
                  {reservation.date}
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

                {/* Button to go to the detail page */}
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
