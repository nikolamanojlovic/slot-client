import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import { getSession } from "../api/auth";

// SLOT_API is the gateway host only, e.g. http://localhost:8000. On a physical
// device or the Android emulator, localhost is not the Mac: use the Mac's LAN IP,
// e.g. http://192.168.x.x:8000
const host: string =
  Constants.expoConfig?.extra?.slotApi || "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: `${host.replace(/\/+$/, "")}/api/v1`,
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
