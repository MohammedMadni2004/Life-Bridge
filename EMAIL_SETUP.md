# Email Setup Guide for Astro

This guide explains how to set up email sending for the "Free Step by Step Guide" signup form.

## Overview

The email signup form is already integrated into your website. The form submits to `/api/subscribe`, which currently logs the email address. To actually send emails, you need to configure one of the options below.

## Option 1: Resend (Recommended - Easiest)

Resend is a modern email API that's easy to set up and has a generous free tier.

### Setup Steps:

1. **Sign up for Resend**

   - Go to [resend.com](https://resend.com) and create a free account
   - Verify your email address

2. **Get your API Key**

   - Go to the API Keys section in your Resend dashboard
   - Create a new API key
   - Copy the key (it starts with `re_`)

3. **Add Domain (Optional but Recommended)**

   - Add your domain in Resend dashboard
   - Add the DNS records they provide to verify ownership
   - This allows you to send from your own domain (e.g., `noreply@yourdomain.com`)

4. **Configure Environment Variables**

   - Create a `.env` file in your project root (if it doesn't exist)
   - Add your Resend API key:
     ```
     RESEND_API_KEY=re_your_api_key_here
     TO_EMAIL=hi@lifebridgeguidance.com
     ```

5. **Update the API Endpoint**

   - Open `src/pages/api/subscribe.ts`
   - Uncomment the Resend code block (lines with `/*` and `*/`)
   - Update the `from` email address to match your verified domain
   - Update the `TO_EMAIL` if needed

6. **Install Resend SDK (Optional)**
   - You can also use the Resend SDK for better TypeScript support:
     ```bash
     npm install resend
     ```
   - Then update the API endpoint to use the SDK instead of fetch

## Option 2: SendGrid

SendGrid is another popular email service with a free tier.

### Setup Steps:

1. **Sign up for SendGrid**

   - Go to [sendgrid.com](https://sendgrid.com) and create an account
   - Complete the verification process

2. **Create API Key**

   - Go to Settings → API Keys
   - Create a new API key with "Full Access" or "Mail Send" permissions
   - Copy the API key

3. **Configure Environment Variables**

   - Add to your `.env` file:
     ```
     SENDGRID_API_KEY=your_sendgrid_api_key_here
     TO_EMAIL=hi@lifebridgeguidance.com
     ```

4. **Update the API Endpoint**
   - Install SendGrid: `npm install @sendgrid/mail`
   - Update `src/pages/api/subscribe.ts` to use SendGrid:

     ```typescript
     import sgMail from "@sendgrid/mail";

     sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

     await sgMail.send({
       to: import.meta.env.TO_EMAIL,
       from: "noreply@yourdomain.com",
       subject: "New Email Signup - Free Step by Step Guide",
       html: `<h2>New Email Signup</h2><p>Email: ${email}</p>`,
     });
     ```

## Option 3: Nodemailer (For Custom SMTP)

If you have your own email server or SMTP credentials:

### Setup Steps:

1. **Install Nodemailer**

   ```bash
   npm install nodemailer
   ```

2. **Configure Environment Variables**

   - Add to your `.env` file:
     ```
     SMTP_HOST=smtp.yourdomain.com
     SMTP_PORT=587
     SMTP_USER=your_email@yourdomain.com
     SMTP_PASS=your_password
     TO_EMAIL=hi@lifebridgeguidance.com
     ```

3. **Update the API Endpoint**
   - Update `src/pages/api/subscribe.ts` to use Nodemailer

## Option 4: Third-Party Form Services (No Backend Required)

If you prefer not to handle email sending yourself, you can use a service like:

### Formspree

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Get your form endpoint URL
4. Update the form action in `index.astro` to point to Formspree's endpoint

### Netlify Forms (If deploying to Netlify)

1. Add `netlify` attribute to your form
2. Netlify will automatically handle form submissions
3. View submissions in your Netlify dashboard

## Option 5: Mailchimp Integration (For Mailing Lists)

If you want to add subscribers to a mailing list:

1. **Sign up for Mailchimp**

   - Go to [mailchimp.com](https://mailchimp.com) and create an account

2. **Get API Key**

   - Go to Account → Extras → API Keys
   - Create a new API key
   - Find your server prefix (e.g., `us1`, `us2`)

3. **Get List ID**

   - Create a new audience/list in Mailchimp
   - Go to Settings → List name and defaults
   - Copy the List ID

4. **Configure Environment Variables**

   ```
   MAILCHIMP_API_KEY=your_api_key_here
   MAILCHIMP_LIST_ID=your_list_id_here
   MAILCHIMP_SERVER=us1
   ```

5. **Update the API Endpoint**
   - Uncomment the Mailchimp code block in `src/pages/api/subscribe.ts`

## Environment Variables Setup

1. Create a `.env` file in your project root:

   ```bash
   touch .env
   ```

2. Add your environment variables (never commit this file!)

3. Make sure `.env` is in your `.gitignore`:

   ```
   .env
   .env.local
   .env.production
   ```

4. For production deployments:
   - **Vercel**: Add environment variables in Project Settings → Environment Variables
   - **Netlify**: Add in Site Settings → Environment Variables
   - **Cloudflare Pages**: Add in Settings → Environment Variables

## Testing

1. Start your dev server: `npm run dev`
2. Navigate to the email signup section on your site
3. Enter a test email address
4. Submit the form
5. Check your email service dashboard or inbox for the submission

## Important Notes

- **Never commit API keys or secrets to git**
- Always use environment variables for sensitive data
- Test email sending in development before deploying
- Consider rate limiting for production to prevent abuse
- You may want to add email validation and spam protection (like reCAPTCHA)

## Current Status

The form is currently set up to log email addresses to the console. To enable actual email sending, follow one of the options above and update the API endpoint accordingly.
