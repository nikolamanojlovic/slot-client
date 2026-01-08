import Constants from "expo-constants";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

const storage: Storage | undefined =
  Platform.OS === "web" ? window.localStorage : undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Connection to Supabase failed.");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
