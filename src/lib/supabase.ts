import Constants from "expo-constants";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

console.log(supabaseUrl, supabaseAnonKey);
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Connection to Supabase failed.");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);
