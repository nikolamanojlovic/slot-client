import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";

const api: AxiosInstance = axios.create({
  baseURL:
    Constants.expoConfig?.extra?.SLOT_API || "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
