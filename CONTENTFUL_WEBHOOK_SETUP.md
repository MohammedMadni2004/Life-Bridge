# Contentful CMS with Webhooks Setup Guide

This guide will help you set up Contentful CMS with webhooks so that when you add or update a blog post in Contentful, your website automatically rebuilds and updates.

## Prerequisites

- Contentful account (free tier works)
- Vercel account (your site is deployed at https://life-bridge-ruby.vercel.app/)
- Contentful Space ID and Access Token

## Step 1: Set Up Contentful Content Model

1. Go to [Contentful](https://www.contentful.com) and sign in
2. Create a new space or use an existing one
3. Go to **Content model** → **Add content type**
4. Name it `Blog Post` (API ID: `blogPost`)

### Required Fields:

1. **Title** (Short text)
   - Field ID: `title`
   - Required: Yes

2. **Description** (Short text)
   - Field ID: `description`
   - Required: Yes

3. **Content** (Long text or Rich text)
   - Field ID: `content`
   - Required: Yes

4. **Author** (Short text)
   - Field ID: `author`
   - Required: No
   - Default: "LifeBridge Guidance"

5. **Published Date** (Date & time)
   - Field ID: `publishedDate`
   - Required: Yes

6. **Tags** (Short text, multiple)
   - Field ID: `tags`
   - Required: No

7. **Slug** (Short text, unique)
   - Field ID: `slug`
   - Required: Yes
   - Validation: Unique
   - Help text: "URL-friendly identifier (e.g., 'my-blog-post')"

## Step 2: Get Contentful API Credentials

1. In Contentful, go to **Settings** → **API keys**
2. Copy your **Space ID**
3. Copy your **Content Delivery API access token** (not Management API)

## Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (`life-bridge-ruby` or similar)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
VERCEL_DEPLOYMENT_HOOK_URL=your_webhook_url_here (we'll create this in Step 5)
```

5. Make sure to add these for **Production**, **Preview**, and **Development** environments
6. Click **Save**

## Step 4: Verify Astro Config

Your `astro.config.mjs` should be set to `output: "static"` (which it already is). 

**Note:** For static sites on Vercel, you don't need an adapter. Vercel will automatically rebuild your site when the webhook is triggered, and during the build, Astro will fetch the latest content from Contentful.

The current config is correct and ready to use!

## Step 5: Create Vercel Deployment Hook

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Git**
3. Scroll down to **Deploy Hooks**
4. Click **Create Hook**
5. Name it: `Contentful Webhook`
6. Select branch: `main` (or your production branch)
7. Copy the **Hook URL** (looks like: `https://api.vercel.com/v1/integrations/deploy/...`)
8. Save this URL - you'll need it for Contentful webhook setup

## Step 6: Set Up Contentful Webhook

1. In Contentful, go to **Settings** → **Webhooks**
2. Click **Add webhook**
3. Configure the webhook:

   **Name:** `Vercel Rebuild Trigger`
   
   **URL:** Paste your Vercel Deploy Hook URL from Step 5
   
   **Triggers:** In the "Content Events" table:
   
   **IMPORTANT:** You need to check triggers for **Entry** (not just Content type)!
   
   - Find the **"Entry"** row in the table
   - Check these boxes in the **Entry** row:
     - ✅ **Publish** (required - triggers when you publish a blog post)
     - ✅ **Unpublish** (recommended)
     - ✅ **Create** (optional - triggers when you create new posts)
     - ✅ **Save** (optional - triggers on any save)
   
   **Note:** Content type triggers only fire when you modify the content model, not when you publish entries. You MUST enable Entry triggers!
   
   **Content types:** Select your content type (e.g., `sOmthijng`) or leave empty for all content types
   
   **HTTP method:** `POST`
   
   **Authentication:** None (Vercel hooks are already secured)

4. Click **Save webhook**

## Step 7: Test the Webhook

1. In Contentful, create a test blog post:
   - Title: "Test Blog Post"
   - Slug: "test-blog-post"
   - Description: "This is a test"
   - Content: "Test content"
   - Published Date: Today's date
   - Click **Publish**

2. Check your Vercel dashboard:
   - Go to **Deployments** tab
   - You should see a new deployment triggered automatically
   - Wait for it to complete (usually 1-2 minutes)

3. Visit your website:
   - Go to https://life-bridge-ruby.vercel.app/blog
   - Your new blog post should appear!

## Step 8: Verify Environment Variables

Make sure your Vercel environment variables are set correctly:

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Verify:
   - `CONTENTFUL_SPACE_ID` is set
   - `CONTENTFUL_ACCESS_TOKEN` is set
3. If you need to update them, click **Edit** and save

## How It Works

1. **You publish a blog post in Contentful**
2. **Contentful sends a webhook** to your Vercel Deploy Hook
3. **Vercel automatically triggers a new deployment**
4. **During build**, Astro fetches the latest content from Contentful
5. **Your website updates** with the new blog post

## Troubleshooting

### Blog posts not showing up?

1. **Check environment variables:**
   - Verify `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` are set in Vercel
   - Make sure they're added for the correct environment (Production)

2. **Check Contentful:**
   - Ensure blog posts are **Published** (not just saved as draft)
   - Verify the content type is exactly `blogPost` (case-sensitive)
   - Check that all required fields are filled

3. **Check webhook:**
   - Go to Contentful → **Settings** → **Webhooks**
   - Click on your webhook
   - Check **Recent deliveries** to see if webhooks are being sent
   - If there are errors, check the error messages

4. **Check Vercel deployments:**
   - Go to Vercel dashboard → **Deployments**
   - Check if new deployments are being triggered
   - Look at build logs for any errors

### Webhook not triggering deployments?

1. **Verify the webhook URL:**
   - Make sure you copied the full Deploy Hook URL from Vercel
   - The URL should start with `https://api.vercel.com/v1/integrations/deploy/`

2. **Check webhook triggers:**
   - In Contentful webhook settings, make sure "Publish" is checked
   - Verify the content type filter is set correctly

3. **Test manually:**
   - In Vercel, go to **Deployments** → **Redeploy** to manually trigger a build
   - This will help verify if the issue is with the webhook or the build itself

### Build errors?

1. **Check build logs:**
   - In Vercel dashboard → **Deployments** → Click on a failed deployment
   - Check the build logs for specific error messages

2. **Common issues:**
   - Missing environment variables
   - Incorrect Contentful Space ID or Access Token
   - Network issues connecting to Contentful API

## Next Steps

Once set up, you can:

- ✅ Add new blog posts directly in Contentful
- ✅ Edit existing posts - changes appear automatically
- ✅ Delete posts - they'll be removed on next deployment
- ✅ No code changes needed for new posts!

## Security Notes

- Keep your Contentful Access Token secure
- Never commit `.env` files to git
- Vercel Deploy Hooks are already secured with unique URLs
- Consider using Contentful's Preview API for draft content

## Additional Resources

- [Contentful Webhooks Documentation](https://www.contentful.com/developers/docs/concepts/webhooks/)
- [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)
- [Astro Contentful Integration](https://docs.astro.build/en/guides/integrations-guide/contentful/)

