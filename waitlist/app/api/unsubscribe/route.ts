import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient();

export const POST = async (req: Request) => {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    // Update subscription status in the waitlist table
    const { error } = await supabase
      .from("waitlist")
      .update({ isSubscribed: false })
      .eq("email", email);

    if (error) {
      return NextResponse.json(
        { error: "Failed to unsubscribe. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unsubscribed successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again later." },
      { status: 500 }
    );
  }
};
