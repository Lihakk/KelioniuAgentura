import type { Reservation } from "../../types/Reservation";
import { apiClient } from "../AxiosInstace";

export const GetReservationByUserId = async (): Promise<Reservation[]> => {
  try {
    const res = await apiClient.get(`/api/Reservation/GetByUser`);
    return res.data;
  } catch {
    throw new Error("Could not get reservations");
  }
};
