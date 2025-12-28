import "dotenv/config";

export default {
  expo: {
    name: "Slot Client",
    slug: "slot-client",
    version: "1.0.0",
    extra: {
      slotApi: process.env.SLOT_API,
      supabaseUrl: process.env.EXPO_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_SUPABASE_ANON_KEY,
    },
  },
};
