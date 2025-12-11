import type { UserProfile } from "../../types/User";
import { apiClient } from "../AxiosInstace";

export const GetUserProfile = async (): Promise<UserProfile> => {
  try {
    const res = await apiClient.get("User/Profile");
    return res.data;
  } catch {
    throw new Error("Could not get user profile");
  }
};
