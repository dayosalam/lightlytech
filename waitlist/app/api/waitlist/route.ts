import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { addToWaitlist } from "@/lib/utils";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Call the waitlist API endpoint to add the email to the waitlist
    const { error: waitlistError } = await addToWaitlist(email);

    // If there was an error adding the email to the waitlist, return it
    if (waitlistError) {
      return NextResponse.json(
        { error: waitlistError.message },
        { status: 500 }
      );
    }

    // Call the email API endpoint to send a confirmation email
    const emailResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`,
      {
        email,
      }
    );

    if (emailResponse.statusText === "OK") {
      return NextResponse.json({
        message: "Email added to waitlist and confirmation sent",
        status: 200,
      });
    } else {
      const error = emailResponse.data.error
        ? emailResponse.data.error
        : "Something went wrong";
      return NextResponse.json(
        { error },
        { status: emailResponse.status ?? 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
