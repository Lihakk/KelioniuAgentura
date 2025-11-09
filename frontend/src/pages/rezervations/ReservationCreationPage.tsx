import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Reservation = {
  id: number;
  tripName: string;
  date: string;
  people: number;
  imageUrl: string;
  isPaid: boolean;
};

// Sample trips for selection
const trips = [
  {
    id: "greece",
    name: "Kelionė į Graikiją",
    imageUrl: "https://images.unsplash.com/photo-1580579628597-4229342c5c99",
  },
  {
    id: "paris",
    name: "Savaitgalis Paryžiuje",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760c0337",
  },
];

let reservationIdCounter = 100; // For generating new IDs

export const ReservationCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tripId: trips[0].id,
    date: "",
    people: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trip = trips.find((t) => t.id === formData.tripId);
    if (!trip) return;

    // Create new reservation
    const newReservation: Reservation = {
      id: reservationIdCounter++,
      tripName: trip.name,
      date: formData.date,
      people: Number(formData.people),
      imageUrl: trip.imageUrl,
      isPaid: false,
    };

    // For now, store in localStorage or state; here we'll simulate with localStorage
    const existingReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    localStorage.setItem(
      "reservations",
      JSON.stringify([...existingReservations, newReservation])
    );

    // Redirect to reservation list
    navigate("/rezervation/1");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Sukurti naują rezervaciją
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
      >
        <label className="flex flex-col">
          Pasirinkite kelionę:
          <select
            name="tripId"
            value={formData.tripId}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
          >
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
        </label>

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

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={() => navigate("/rezervacijos")}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Atšaukti
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Sukurti
          </button>
        </div>
      </form>
    </div>
  );
};
