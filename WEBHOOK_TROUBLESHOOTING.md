# Webhook Troubleshooting Guide

## Quick Checklist

### 1. Verify Webhook is Being Sent
- Go to Contentful → **Settings** → **Webhooks**
- Click on your webhook
- Check **Recent deliveries** tab
- You should see entries when you publish
- If you see errors, check the error message

### 2. Verify Vercel Deployment Hook
Your deploy hook URL: `https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz`

**Test it manually:**
```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz
```

You should get a response like:
```json
{"job":{"id":"...","state":"PENDING","createdAt":...}}
```

### 3. Check Environment Variables in Vercel

**Critical:** Make sure you're using the **Content Delivery API** token, NOT the Management API token!

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify these are set for **Production** environment:
   - `CONTENTFUL_SPACE_ID` - Should be your Space ID (not the project ID)
   - `CONTENTFUL_ACCESS_TOKEN` - Should be the **Content Delivery API** access token

**How to get the correct token:**
1. Go to Contentful → **Settings** → **API keys**
2. Find the **Content Delivery API** section
3. Copy the **Access token** (NOT the Management API token)
4. This token should start with something like `abc123...` (not a long UUID)

### 4. Verify Content Type Name

The content type must be exactly `blogPost` (case-sensitive, camelCase).

1. Go to Contentful → **Content model**
2. Click on your "Blog Post" content type
3. Check the **API identifier** - it MUST be `blogPost`
4. If it's different (like `blog-post` or `BlogPost`), you need to either:
   - Change it to `blogPost` in Contentful, OR
   - Update the code to match your content type name

### 5. Verify Blog Post is Published

1. Go to Contentful → **Content**
2. Find your blog post
3. Make sure it shows **Published** status (green checkmark)
4. If it only shows "Draft", click **Publish**

### 6. Check Vercel Build Logs

1. Go to Vercel Dashboard → **Deployments**
2. Click on the most recent deployment
3. Check the **Build Logs** for errors
4. Look for:
   - "Error fetching blog posts from Contentful"
   - "Cannot find module 'contentful'"
   - Any API errors

### 7. Test Contentful Connection

Add this test to verify your credentials work. Create a test file:

```javascript
// test-contentful.js (temporary file for testing)
import contentful from "contentful";

const client = contentful.createClient({
  space: "YOUR_SPACE_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
});

client.getEntries({ content_type: "blogPost" })
  .then((entries) => {
    console.log("✅ Success! Found", entries.items.length, "blog posts");
    entries.items.forEach((item) => {
      console.log("-", item.fields.title);
    });
  })
  .catch((error) => {
    console.error("❌ Error:", error.message);
  });
```

## Common Issues & Solutions

### Issue 1: "No blog posts showing up"

**Possible causes:**
- Wrong access token (using Management API instead of Content Delivery API)
- Content type name mismatch
- Blog post not published
- Environment variables not set in Vercel

**Solution:**
1. Double-check you're using Content Delivery API token
2. Verify content type is exactly `blogPost`
3. Make sure blog post is published
4. Redeploy in Vercel after setting environment variables

### Issue 2: "Webhook not triggering deployments"

**Possible causes:**
- Webhook URL incorrect
- Webhook triggers not configured
- Content type filter blocking the webhook

**Solution:**
1. Verify webhook URL matches exactly: `https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz`
2. Check webhook has "Publish" trigger enabled
3. Try removing content type filter (leave empty) to test
4. Check "Recent deliveries" in Contentful webhook settings

### Issue 3: "Build succeeds but no posts appear"

**Possible causes:**
- Contentful API returning empty results
- Fallback to local posts is working (so you see old posts)
- Environment variables not accessible during build

**Solution:**
1. Check build logs for Contentful errors
2. Verify environment variables are set for Production
3. Manually trigger a redeploy after setting env vars
4. Check Contentful has published posts

### Issue 4: "Multiple access tokens - which one?"

**Contentful has two types of tokens:**

1. **Content Delivery API** (CDA) - ✅ Use this one
   - Location: Settings → API keys → Content Delivery API
   - Used for: Reading published content
   - Format: Usually shorter, alphanumeric

2. **Content Management API** (CMA) - ❌ Don't use this
   - Location: Settings → API keys → Content Management API  
   - Used for: Creating/editing content (admin operations)
   - Format: Usually longer, UUID-like

**You need the Content Delivery API token!**

## Step-by-Step Verification

1. **Test the webhook manually:**
   ```bash
   curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz
   ```
   Should return: `{"job":{"id":"...","state":"PENDING"...}}`

2. **Check Contentful webhook deliveries:**
   - Contentful → Settings → Webhooks → Your webhook → Recent deliveries
   - Should show successful deliveries when you publish

3. **Check Vercel deployments:**
   - Vercel Dashboard → Deployments
   - Should see new deployments triggered by webhook

4. **Verify environment variables:**
   - Vercel → Settings → Environment Variables
   - Both `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` must be set
   - Must be set for **Production** environment

5. **Check build logs:**
   - Vercel → Deployments → Latest deployment → Build Logs
   - Look for any Contentful API errors

6. **Verify content type:**
   - Contentful → Content model → Blog Post
   - API identifier must be exactly: `blogPost`

## Still Not Working?

If after checking all the above it's still not working:

1. **Manually trigger a rebuild:**
   - Vercel Dashboard → Deployments → Click "..." → Redeploy
   - This will test if the build works (independent of webhook)

2. **Check Contentful webhook logs:**
   - Contentful → Settings → Webhooks → Your webhook
   - Check "Recent deliveries" for error messages

3. **Test Contentful API directly:**
   - Use the test script above to verify your credentials work

4. **Check Vercel function logs:**
   - If using serverless functions, check Vercel function logs

