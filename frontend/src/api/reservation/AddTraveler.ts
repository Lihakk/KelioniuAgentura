import type { CreateTraveler } from "../../types/Reservation";
import { apiClient } from "../AxiosInstace";

export const AddTraveler = async (traveler: CreateTraveler) => {
  try {
    const res = await apiClient.post(`/api/Reservation/AddTraveler`, traveler);
    return res.data;
  } catch {
    throw new Error("Could not add traveler");
  }
};
