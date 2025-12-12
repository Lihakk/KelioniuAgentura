import { apiClient } from "../AxiosInstace";

export const DeleteTraveler = async (id: number) => {
  try {
    const res = await apiClient.delete(`Reservation/DeleteTraveler/${id}`);
    return res.data;
  } catch {
    throw new Error("Could not delete traveler");
  }
};
