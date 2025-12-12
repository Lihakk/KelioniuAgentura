import type { Reservation } from "../../types/Reservation";
import { apiClient } from "../AxiosInstace";

export const GetReservationById = async (id: number): Promise<Reservation> => {
  try {
    const res = await apiClient.get(`Reservation/GetById/${id}`);
    return res.data;
  } catch {
    throw new Error("Could not get reservations");
  }
};
