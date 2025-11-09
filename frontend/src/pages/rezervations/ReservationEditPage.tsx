import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Reservation = {
  id: number;
  tripName: string;
  date: string;
  people: number;
  imageUrl: string;
  isPaid: boolean;
};

const reservationsData: Reservation[] = [
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

export const RezervationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(reservationsData);

  const reservation = reservations.find((r) => r.id === Number(id));

  const [formData, setFormData] = useState({
    date: reservation?.date || "",
    people: reservation?.people || 1,
  });

  if (!reservation)
    return (
      <p className="text-center mt-12 text-gray-500">Rezervacija nerasta.</p>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservation.id
          ? { ...r, date: formData.date, people: Number(formData.people) }
          : r
      )
    );
    navigate(`/rezervation/${reservation.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Redaguoti rezervaciją
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
      >
        <label className="flex flex-col">
          Data:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
            required
          />
        </label>
        <label className="flex flex-col">
          Keliautojų skaičius:
          <input
            type="number"
            name="people"
            value={formData.people}
            onChange={handleChange}
            min={1}
            className="mt-1 p-2 border rounded-md"
            required
          />
        </label>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate(`/rezervation/${reservation.id}`)}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Atšaukti
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Išsaugoti
          </button>
        </div>
      </form>
    </div>
  );
};
