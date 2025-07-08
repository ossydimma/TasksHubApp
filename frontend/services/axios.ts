import axios from "axios";
import { tokenService } from "./tokenService";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach authorization header if token exists
api.interceptors.request.use((config) => {
  const token = tokenService.get();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // unauthorized 
    if (error.response.status === 401) {
      console.warn("Received 401 Unauthorized from API");
    }

    return Promise.reject(error);
  }
);
