import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type {
  Reservation,
  Traveler,
  CreateTraveler,
} from "../../types/Reservation";
import { GetReservationById } from "../../api/reservation/GetReservationById";
import { AddTraveler } from "../../api/reservation/AddTraveler";
import { DeleteTraveler } from "../../api/reservation/DeleteTraveler";
import { UpdateReservation } from "../../api/reservation/UpdateReservation";

// UI-only extension (not sent to backend)
type TravelerWithMeta = (Traveler | CreateTraveler) & {
  _markedForDelete?: boolean;
};

export const RezervationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    people: 1,
  });

  const [travelers, setTravelers] = useState<TravelerWithMeta[]>([]);

  // ---------------------------
  // Fetch reservation
  // ---------------------------
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const data = await GetReservationById(id ? Number(id) : 0);

        setReservation(data);

        setFormData({
          date: data.date?.split("T")[0] ?? "",
          people: data.travelers?.length || 1,
        });

        setTravelers(
          (data.travelers || []).map((t) => ({
            ...t,
            birthDate: t.birthDate?.split("T")[0] ?? "",
          }))
        );
      } catch (error) {
        console.error("Could not fetch reservation details.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  // ---------------------------
  // Loading / Not found
  // ---------------------------
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

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleTravelerChange = (
    index: number,
    field: keyof CreateTraveler,
    value: string
  ) => {
    setTravelers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const addTraveler = () => {
    const newTraveler: TravelerWithMeta = {
      firstName: "",
      lastName: "",
      birthDate: "",
      documentNumber: "",
      reservationId: reservation.id,
    };

    setTravelers((prev) => [...prev, newTraveler]);
  };

  const markTravelerForDelete = (index: number) => {
    setTravelers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, _markedForDelete: true } : t))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1️⃣ Delete marked travelers
      for (const traveler of travelers) {
        if ("id" in traveler && traveler._markedForDelete) {
          await DeleteTraveler(traveler.id);
        }
      }

      // 2️⃣ Add new travelers
      for (const traveler of travelers) {
        if (!("id" in traveler) && !traveler._markedForDelete) {
          await AddTraveler(traveler);
        }
      }

      // 3️⃣ Update reservation metadata
      await UpdateReservation({
        id: reservation.id,
        status: reservation.status,
        payment: reservation.payment,
      });

      navigate(`/rezervation/${reservation.id}`);
    } catch (error) {
      console.error("Error saving reservation:", error);
    }
  };

  const handleCancelReservation = () => {
    navigate(`/reservation`);
  };

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Redaguoti rezervaciją
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
      >
        {/* Travelers */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Keliautojų informacija
          </h2>

          {travelers
            .filter((t) => !t._markedForDelete)
            .map((traveler, index) => (
              <div
                key={index}
                className="mb-6 p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">
                    Keliautojas {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => markTravelerForDelete(index)}
                    className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
                  >
                    Pašalinti
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col">
                    Vardas:
                    <input
                      type="text"
                      value={traveler.firstName}
                      onChange={(e) =>
                        handleTravelerChange(index, "firstName", e.target.value)
                      }
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </label>

                  <label className="flex flex-col">
                    Pavardė:
                    <input
                      type="text"
                      value={traveler.lastName}
                      onChange={(e) =>
                        handleTravelerChange(index, "lastName", e.target.value)
                      }
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </label>

                  <label className="flex flex-col">
                    Gimimo data:
                    <input
                      type="date"
                      value={traveler.birthDate}
                      onChange={(e) =>
                        handleTravelerChange(index, "birthDate", e.target.value)
                      }
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </label>

                  <label className="flex flex-col">
                    Dokumento numeris:
                    <input
                      type="text"
                      value={traveler.documentNumber}
                      onChange={(e) =>
                        handleTravelerChange(
                          index,
                          "documentNumber",
                          e.target.value
                        )
                      }
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </label>
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

        {/* Actions */}
        <div className="flex justify-between mt-4 pt-4 border-t">
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
