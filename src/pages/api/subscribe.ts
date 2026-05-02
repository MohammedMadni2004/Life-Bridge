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

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Free Step-by-Step Guide</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f9fafb;
            color: #111827;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
          }
          .header {
            background-color: #0f172a; /* Sleek dark blue/black */
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .content {
            padding: 32px 24px;
            line-height: 1.6;
          }
          .content p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #374151;
          }
          .button-container {
            text-align: center;
            margin: 32px 0;
          }
          .button {
            display: inline-block;
            background-color: #3b82f6; /* Modern blue */
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          .button:hover {
            background-color: #2563eb;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 24px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to LifeBridge Guidance</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Taking the first step toward guidance and healing is often the hardest part, and we are truly glad you are here. Please know that you are not alone on this journey.</p>
            <p>As promised, here is your exclusive <strong>Step-by-Step Guide</strong>. We've packed it with actionable insights and strategies to help you get started immediately.</p>
            
            <div class="button-container">
              <a href="${pdfUrl}" class="button" target="_blank" rel="noopener noreferrer">Download Your PDF Guide</a>
            </div>
            
            <p>We hope this guide brings you clarity and comfort as you move forward.</p>
            <p>Best regards,<br>The LifeBridge Guidance Team</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} LifeBridge Guidance. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: 'LifeBridge Guidance <support@lifebridgeguidance.com>', // Ensure domain is verified in Resend dashboard
        to: [email],
        subject: "Here is your Step-by-Step Guide!",
        html: htmlTemplate,
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