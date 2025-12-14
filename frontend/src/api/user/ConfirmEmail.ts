import { apiClient } from "../AxiosInstace";

export const ConfirmEmail = async (code: string): Promise<void> => {
  try {
    await 
    
    apiClient.post("/api/User/ConfirmEmail", { code });
  } catch {
    throw new Error("Could not confirm email");
  }
};
