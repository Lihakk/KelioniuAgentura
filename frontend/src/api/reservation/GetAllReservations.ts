import type { Reservation } from "../../types/Reservation";
import { apiClient } from "../AxiosInstace";

export const GetAllReservations = async (): Promise<Reservation[]> => {
  try {
    const res = await apiClient.get("Reservation/GetAll");
    return res.data;
  } catch {
    throw new Error("Could not get reservations");
  }
};
