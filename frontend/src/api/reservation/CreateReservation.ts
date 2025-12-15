import type { ReservationCreation } from "../../types/Reservation";
import { apiClient } from "../AxiosInstace";

export const CreateReservation = async (reservation: ReservationCreation) => {
  try {
    const res = await apiClient.post(`/api/Reservation/Create`, reservation);
    return res.data;
  } catch {
    throw new Error("Could not update reservation");
  }
};
