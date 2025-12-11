import { apiClient } from "../AxiosInstace";

export const ConfirmEmail = async (code: string): Promise<void> => {
  try {
    await 
    
    apiClient.post("User/ConfirmEmail", { code });
  } catch {
    throw new Error("Could not confirm email");
  }
};
