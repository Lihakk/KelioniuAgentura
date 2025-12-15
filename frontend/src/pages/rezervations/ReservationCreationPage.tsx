import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type {
  ReservationCreation,
  CreateTraveler,
  ReservationTrip,
} from "../../types/Reservation";
import { CreateReservation } from "../../api/reservation/CreateReservation";
import { apiClient } from "../../api/AxiosInstace";

export const ReservationCreationPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<ReservationTrip | null>(null);
  const [travelers, setTravelers] = useState<CreateTraveler[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await apiClient.get(`/api/admin/trips/${tripId}`);
        setTrip(res.data);
      } catch {
        console.error("Could not load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleTravelerChange = (
    index: number,
    field: keyof CreateTraveler,
    value: string
  ) => {
    setTravelers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTraveler = () => {
    setError("");
    setTravelers((prev) => [
      ...prev,
      {
        firstName: "",
        lastName: "",
        birthDate: "",
        documentNumber: "",
        reservationId: 0,
      },
    ]);
  };

  const removeTraveler = (index: number) => {
    setTravelers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (travelers.length === 0) {
      setError("Rezervacija neįmanoma – turi būti bent vienas keliautojas.");
      return;
    }

    try {
      const payload: ReservationCreation = {
        tripId: Number(tripId),
        travelers,
      };

      await CreateReservation(payload);
      navigate("/reservationsList");
    } catch (error) {
      console.error("Could not create reservation", error);
    }
  };

  const totalPrice =
    trip && travelers.length > 0 ? trip.price * travelers.length : 0;

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500">Kraunama kelionė...</p>
    );
  }

  if (!trip) {
    return <p className="text-center mt-12 text-gray-500">Kelionė nerasta.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">Nauja rezervacija</h1>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border">
        <h2 className="text-xl font-semibold">{trip.name}</h2>
        <p className="text-sm text-gray-600">
          {trip.startDate.split("T")[0]} – {trip.endDate.split("T")[0]}
        </p>
        <p className="mt-2 font-medium">
          Kaina vienam asmeniui: <b>{trip.price} €</b>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
      >
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Keliautojų informacija
          </h2>

          {travelers.map((traveler, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Keliautojas {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeTraveler(index)}
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
                >
                  Pašalinti
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Vardas"
                  value={traveler.firstName}
                  onChange={(e) =>
                    handleTravelerChange(index, "firstName", e.target.value)
                  }
                  className="p-2 border rounded-md"
                  required
                />

                <input
                  type="text"
                  placeholder="Pavardė"
                  value={traveler.lastName}
                  onChange={(e) =>
                    handleTravelerChange(index, "lastName", e.target.value)
                  }
                  className="p-2 border rounded-md"
                  required
                />

                <input
                  type="date"
                  value={traveler.birthDate}
                  onChange={(e) =>
                    handleTravelerChange(index, "birthDate", e.target.value)
                  }
                  className="p-2 border rounded-md"
                  required
                />

                <input
                  type="text"
                  placeholder="Dokumento numeris"
                  value={traveler.documentNumber}
                  onChange={(e) =>
                    handleTravelerChange(
                      index,
                      "documentNumber",
                      e.target.value
                    )
                  }
                  className="p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTraveler}
            className="w-full py-2 rounded-md border-2 border-dashed border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
          >
            + Pridėti keliautoją
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium text-center">
            {error}
          </p>
        )}

        <div className="text-right font-semibold text-lg">
          Bendra kaina: {totalPrice} €
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Atšaukti
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Sukurti rezervaciją
          </button>
        </div>
      </form>
    </div>
  );
};
