import { apiClient } from "../AxiosInstace";

export const GetUserProfile = async (): Promise<void> => {
  try {
    apiClient.get("User/Profile");
  } catch {
    throw new Error("Could not get user profile");
  }
};
