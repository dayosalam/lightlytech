import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import WaitlistEmail from "@/components/EmailTemplate";
import { render } from "@react-email/components";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailTemplate = await render(WaitlistEmail({ userEmail: email }));

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to Lightly",
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully", info });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Something went wrong." },
      { status: 500 }
    );
  }
}
