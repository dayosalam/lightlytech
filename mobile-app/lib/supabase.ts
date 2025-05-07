import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

console.log("supabse",Constants.expoConfig?.extra?.SUPABASE_URL)
// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://scludyaklhcevtahonwi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbHVkeWFrbGhjZXZ0YWhvbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjkzNjgsImV4cCI6MjA1MjU0NTM2OH0.T3KUMrXvLlZVHhMpvV-sI69iBfzfDxcPUMlyvRptvYk"
);

