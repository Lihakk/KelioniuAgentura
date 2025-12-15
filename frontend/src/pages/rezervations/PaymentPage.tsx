import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../../utils/stripe";
import { GetReservationById } from "../../api/reservation/GetReservationById";
import { apiClient } from "../../api/AxiosInstace";
import type { Reservation } from "../../types/Reservation";

type PaymentFormProps = {
  clientSecret: string;
  reservationId: number;
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  reservationId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Kortelės forma neparuošta");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setError(result.error.message ?? "Mokėjimas nepavyko");
      setLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      await apiClient.post("/api/Payment/mark-paid", {
        reservationId,
      });

      navigate(`/reservation/${reservationId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              fontSize: "16px",
            },
          },
        }}
      />

      {error && (
        <p className="text-red-600 text-sm font-medium text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
      >
        {loading ? "Apmokėjimas..." : "Sumokėti"}
      </button>
    </form>
  );
};

export const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const reservationData = await GetReservationById(Number(id));
        setReservation(reservationData);

        const response = await apiClient.post("/api/Payment/create-intent", {
          reservationId: reservationData.id,
        });

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Nepavyko inicijuoti mokėjimo", err);
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500">Kraunamas mokėjimas...</p>
    );
  }

  if (!reservation || !clientSecret) {
    return (
      <p className="text-center mt-12 text-red-600">
        Nepavyko inicijuoti mokėjimo.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Mokėjimas už rezervaciją
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-xl mb-2">
            {reservation.reservationTrip.name}
          </h2>

          <p>
            <span className="font-semibold">Keliautojų skaičius:</span>{" "}
            {reservation.travelers.length}
          </p>

          <p>
            <span className="font-semibold">Bendra suma:</span> €{" "}
            {reservation.totalAmount}
          </p>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            clientSecret={clientSecret}
            reservationId={reservation.id}
          />
        </Elements>

        <button
          onClick={() => navigate(`/reservation/${reservation.id}`)}
          className="text-sm text-gray-500 hover:underline self-center"
        >
          Grįžti atgal
        </button>
      </div>
    </div>
  );
};
