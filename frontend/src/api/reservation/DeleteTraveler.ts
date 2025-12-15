import { apiClient } from "../AxiosInstace";

export const DeleteTraveler = async (id: number) => {
  try {
    const res = await apiClient.delete(`/api/Reservation/DeleteTraveler/${id}`);
    return res.data;
  } catch {
    throw new Error("Could not delete traveler");
  }
};
