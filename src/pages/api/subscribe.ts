import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "support@lifebridgeguidance.com",
        pass: "TEST_PASSWORD",
      },
    });

    try {
      await transporter.sendMail({
        from: '"LifeBridge Guidance" <support@lifebridgeguidance.com>',
        to: email,
        subject: "Your Free Step by Step Guide",
        html: `<h2>Thank you for signing up!</h2>`,
      });

      console.log("Email sent:", email);
    } catch (err:any) {
      console.log("Email failed (non-blocking):", err.message);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
};