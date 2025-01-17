import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  Constants.expoConfig?.extra?.SUPABASE_URL ?? "",
  Constants.expoConfig?.extra?.SUPABASE_API ?? ""
);
