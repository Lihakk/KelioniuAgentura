import type { RegisterUserDetails } from "../../types/User";
import { apiClient } from "../AxiosInstace";

export const RegisterUser = async (
  registerInfo: RegisterUserDetails
): Promise<void> => {
  try {
    await apiClient.post("/api/User/Register", registerInfo);
  } catch {
    throw new Error("Could not register the user");
  }
};
