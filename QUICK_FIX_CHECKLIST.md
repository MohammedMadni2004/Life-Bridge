# Quick Fix Checklist - Contentful Webhook Not Working

## Most Common Issues (Check These First!)

### ✅ Issue #1: Wrong Access Token Type
**This is the #1 cause of problems!**

Contentful has TWO types of tokens:
- ❌ **Content Management API** (CMA) - DON'T USE THIS
- ✅ **Content Delivery API** (CDA) - USE THIS ONE

**How to check:**
1. Go to Contentful → **Settings** → **API keys**
2. Look for **"Content Delivery API"** section (NOT "Content Management API")
3. Copy the **Access token** from that section
4. Update it in Vercel → **Settings** → **Environment Variables**

**The correct token:**
- Should be in the "Content Delivery API" section
- Usually shorter, alphanumeric string
- Used for reading published content

### ✅ Issue #2: Content Type Name Mismatch
**Must be exactly `blogPost` (camelCase, case-sensitive)**

1. Go to Contentful → **Content model**
2. Click on your "Blog Post" content type
3. Check the **API identifier** field
4. It MUST say: `blogPost` (exactly like this)
5. If it's different, either:
   - Change it in Contentful to `blogPost`, OR
   - Update the code in `src/lib/contentful.ts` line 30 to match your content type

### ✅ Issue #3: Environment Variables Not Set for Production
**Vercel needs env vars for the Production environment**

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Make sure both variables are set:
   - `CONTENTFUL_SPACE_ID` = Your Space ID (from Contentful → Settings → API keys)
   - `CONTENTFUL_ACCESS_TOKEN` = Content Delivery API token (NOT Management API)
3. **Critical:** Check the environment dropdown - must include **Production** ✅
4. **After adding/updating, you MUST redeploy:**
   - Go to **Deployments** → Click "..." on latest → **Redeploy**
   - Or trigger via webhook: `curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz`

**Test your setup:**
- Visit: `https://life-bridge-ruby.vercel.app/test-contentful`
- This page will show if environment variables are set correctly

### ✅ Issue #4: Blog Post Not Actually Published
**Draft posts won't appear!**

1. Go to Contentful → **Content**
2. Find your blog post
3. Check if it shows **"Published"** (green checkmark)
4. If it shows "Draft", click the **Publish** button
5. After publishing, the webhook should trigger automatically

### ✅ Issue #5: Webhook Not Configured Correctly

**Check webhook settings:**
1. Contentful → **Settings** → **Webhooks**
2. Click on your webhook
3. Verify:
   - **URL** matches exactly: `https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz`
   - **Triggers** include: ✅ Publish
   - **HTTP method:** POST
4. Check **Recent deliveries** tab - you should see entries when you publish

### ✅ Issue #6: Webhook Triggering But Build Failing

**Check Vercel build logs:**
1. Vercel Dashboard → **Deployments**
2. Click on the latest deployment
3. Check **Build Logs**
4. Look for errors like:
   - "Error fetching blog posts from Contentful"
   - "401 Unauthorized" (wrong token)
   - "404 Not Found" (wrong space ID or content type)

## Quick Test Steps

### Step 1: Test Webhook Manually
```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz
```

Should return: `{"job":{"id":"...","state":"PENDING"...}}`

If this works, the webhook URL is correct.

### Step 2: Check Contentful Webhook Deliveries
1. Contentful → Settings → Webhooks → Your webhook
2. Click **Recent deliveries**
3. When you publish a post, you should see a new delivery
4. If you see errors, click on the delivery to see the error message

### Step 3: Verify Environment Variables
1. Vercel → Settings → Environment Variables
2. Verify both are set for **Production**:
   - `CONTENTFUL_SPACE_ID` = Your Space ID
   - `CONTENTFUL_ACCESS_TOKEN` = Content Delivery API token (NOT Management API)

### Step 4: Manually Trigger Rebuild
After fixing environment variables:
1. Vercel → Deployments
2. Click "..." on latest deployment
3. Click **Redeploy**
4. Check build logs for Contentful connection

### Step 5: Check Build Logs
Look for these log messages (I added them to help debug):
- `[Contentful] Attempting to fetch blog posts...`
- `[Contentful] Found X blog posts`
- `[Contentful] Error fetching blog posts: ...`

## Still Not Working?

1. **Check the build logs** - I added detailed logging to help debug
2. **Verify you're using Content Delivery API token** (most common issue!)
3. **Make sure content type is exactly `blogPost`**
4. **Ensure blog post is Published** (not just saved)
5. **Redeploy after changing environment variables**

## Need More Help?

Check the detailed troubleshooting guide: `WEBHOOK_TROUBLESHOOTING.md`

