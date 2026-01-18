import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // TODO: Replace with your email service integration
    // Option 1: Using Resend (recommended - see setup instructions below)
    // Option 2: Using SendGrid, Nodemailer, or another email service
    // Option 3: Using a third-party form service like Formspree

    // Example with Resend (uncomment and configure after setup):
    /*
		const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
		const TO_EMAIL = import.meta.env.TO_EMAIL || 'hi@lifebridgeguidance.com';
		
		const resendResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: 'LifeBridge Guidance <noreply@yourdomain.com>',
				to: TO_EMAIL,
				subject: 'New Email Signup - Free Step by Step Guide',
				html: `
					<h2>New Email Signup</h2>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
				`,
			}),
		});

		if (!resendResponse.ok) {
			throw new Error('Failed to send email');
		}
		*/

    // For now, just log the email (remove this in production)
    console.log("New email signup:", email);

    // TODO: Add email to your mailing list service (Mailchimp, ConvertKit, etc.)
    // Example with Mailchimp:
    /*
		const MAILCHIMP_API_KEY = import.meta.env.MAILCHIMP_API_KEY;
		const MAILCHIMP_LIST_ID = import.meta.env.MAILCHIMP_LIST_ID;
		const MAILCHIMP_SERVER = import.meta.env.MAILCHIMP_SERVER; // e.g., 'us1'
		
		const mailchimpResponse = await fetch(
			`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email_address: email,
					status: 'subscribed',
				}),
			}
		);

		if (!mailchimpResponse.ok) {
			throw new Error('Failed to add to mailing list');
		}
		*/

    return new Response(
      JSON.stringify({ success: true, message: "Email received successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing email signup:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
