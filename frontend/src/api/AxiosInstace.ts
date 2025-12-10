import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      console.warn("Token expired or invalid");
    }
    return Promise.reject(error);
  }
);
