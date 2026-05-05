import type { APIRoute } from "astro";
import { Resend } from "resend";

// Ensure the API key is set in your .env file
const resend = new Resend(import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY || "re_placeholder");

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400 }
      );
    }

    // Determine the base URL for the PDF link based on the current request
    const baseUrl = `${url.protocol}//${url.host}`;
    const pdfUrl = `${baseUrl}/guide.pdf`; // Points to public/guide.pdf
    const templateId= import.meta.env.RESEND_TEMPLATE_ID;

    try {
      const { data, error } = await resend.emails.send({
        from: 'LifeBridge Guidance <support@lifebridgeguidance.com>', // Ensure domain is verified in Resend dashboard
        to: [email],
        subject: "Here is your Step-by-Step Guide!",
        template: {
          id: templateId,
          variables: {
            pdfUrl: pdfUrl
          }
        }
      });

      if (error) {
        console.error("Resend API Error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to send email via Resend" }),
          { status: 500 }
        );
      }

      console.log("Email sent successfully via Resend:", data);
    } catch (err: any) {
      console.error("Resend SDK Catch Block:", err.message);
      return new Response(
        JSON.stringify({ error: "Failed to process email delivery" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
};