import type { ReservationUpdate } from "../../types/Reservation";
import { apiClient } from "../AxiosInstace";

export const UpdateReservation = async (
  reservationUpdated: ReservationUpdate
) => {
  try {
    const res = await apiClient.put(`Reservation/Update`, reservationUpdated);
    return res.data;
  } catch {
    throw new Error("Could not update reservation");
  }
};
