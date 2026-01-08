import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import { getSession } from "../types/api/auth/auth.function";

const api: AxiosInstance = axios.create({
  baseURL:
    Constants.expoConfig?.extra?.SLOT_API || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const { session: sessionData } = await getSession();
  const token = sessionData?.access_token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
