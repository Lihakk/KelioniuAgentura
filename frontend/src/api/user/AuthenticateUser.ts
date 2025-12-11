import type { LoginCredentials } from "../../types/User";
import { apiClient } from "../AxiosInstace";

export type AuthResponse = {
  success: boolean;
  emailConfirmed: boolean;
  message?: string;
};

export const AuthenticateUser = async (
  loginCredentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post("/User/Login", loginCredentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Login failed");
  }
};
