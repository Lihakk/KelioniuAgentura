import type { UserProfile } from "../../types/User";
import { apiClient } from "../AxiosInstace";

export const UpdateProfile = async (
  profile: UserProfile
): Promise<UserProfile> => {
  try {
    const res = await apiClient.put("User/UpdateProfile", profile);
    return res.data;
  } catch {
    throw new Error("Could not get user profile");
  }
};
