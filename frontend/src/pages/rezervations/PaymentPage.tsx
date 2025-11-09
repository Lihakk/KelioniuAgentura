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

// Sample data (replace with API)
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

export const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(reservationsData);
  const [loading, setLoading] = useState(false);

  const reservation = reservations.find((r) => r.id === Number(id));
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  if (!reservation)
    return (
      <p className="text-center mt-12 text-gray-500">Rezervacija nerasta.</p>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment delay
    setTimeout(() => {
      // Update reservation as paid
      setReservations((prev) =>
        prev.map((r) => (r.id === reservation.id ? { ...r, isPaid: true } : r))
      );
      setLoading(false);
      navigate(`/rezervation/${reservation.id}`);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Mokėjimas už rezervaciją
      </h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-xl mb-2">{reservation.tripName}</h2>
          <p>
            <span className="font-semibold">Data:</span> {reservation.date}
          </p>
          <p>
            <span className="font-semibold">Keliautojų skaičius:</span>{" "}
            {reservation.people}
          </p>
          <p>
            <span className="font-semibold">Bendra suma:</span> €
            {reservation.people * 100}
          </p>
        </div>

        <form onSubmit={handlePayment} className="flex flex-col gap-4">
          <input
            type="text"
            name="cardNumber"
            placeholder="Kortelės numeris"
            value={formData.cardNumber}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="expiry"
              placeholder="Galiojimo data (MM/YY)"
              value={formData.expiry}
              onChange={handleChange}
              className="p-2 border rounded-md flex-1"
              required
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              className="p-2 border rounded-md w-24"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {loading ? "Apmokėjimas..." : "Sumokėti"}
          </button>
        </form>
      </div>
    </div>
  );
};
