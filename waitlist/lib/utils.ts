import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addToWaitlist = async (email: string) => {
  if (!email) throw new Error("Email is required");

  // check if email is already in the database
  const { data, error: dataError } = await supabase
    .from("waitlist")
    .select("email")
    .eq("email", email)
    .limit(1);

  if (dataError) throw new Error(dataError.message);

  if (data.length > 0) throw new Error("You are already on the waitlist");

  const { error: waitlistError } = await supabase
    .from("waitlist")
    .insert({ email });

  return {
    error: waitlistError,
  };
};
