# Vercel Environment Variables Setup

## Your Contentful Credentials

Based on your information:
- **Space ID:** `plw4hte0o0h2`
- **Content Delivery API Token:** `dFgQLZIIg1WvpuF943OoUxivq8_ZQmjSz4Uax4Zjf_E`
- **Vercel Deploy Hook:** `https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz`

## Step-by-Step: Set Environment Variables in Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project (`life-bridge-ruby` or similar)

2. **Navigate to Environment Variables:**
   - Click **Settings** (in the top navigation)
   - Click **Environment Variables** (in the left sidebar)

3. **Add CONTENTFUL_SPACE_ID:**
   - Click **Add New**
   - **Key:** `CONTENTFUL_SPACE_ID`
   - **Value:** `plw4hte0o0h2`
   - **Environment:** Select **Production**, **Preview**, and **Development** (check all three)
   - Click **Save**

4. **Add CONTENTFUL_ACCESS_TOKEN:**
   - Click **Add New** again
   - **Key:** `CONTENTFUL_ACCESS_TOKEN`
   - **Value:** `dFgQLZIIg1WvpuF943OoUxivq8_ZQmjSz4Uax4Zjf_E`
   - **Environment:** Select **Production**, **Preview**, and **Development** (check all three)
   - Click **Save**

5. **Verify the variables are set:**
   - You should see both variables listed:
     - `CONTENTFUL_SPACE_ID` = `plw4hte0o0h2`
     - `CONTENTFUL_ACCESS_TOKEN` = `dFgQLZIIg1WvpuF943OoUxivq8_ZQmjSz4Uax4Zjf_E`

6. **IMPORTANT: Redeploy after adding variables:**
   - Go to **Deployments** tab
   - Click the "..." (three dots) on the latest deployment
   - Click **Redeploy**
   - Or trigger via webhook: `curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_WPM1Zm36AQpoZsGuO9mtirQ8LyP7/hVotux8Ulz`

## Content Type Setup

Your content type is named "SOmthijng" in Contentful. The code will automatically detect it, but for best practice:

**Option 1: Rename your content type (Recommended)**
1. Go to Contentful → **Content model**
2. Click on "SOmthijng"
3. Click **Settings** (gear icon)
4. Change **API identifier** to: `blogPost`
5. Save

**Option 2: Keep "SOmthijng"**
- The code will automatically detect and use it
- Make sure it has all the required fields (title, description, content, slug, publishedDate, etc.)

## Verify Your Content Type Has Required Fields

Your "SOmthijng" content type should have these fields:

1. **title** (Short text) - Required
2. **description** (Short text) - Required  
3. **content** (Long text or Rich text) - Required
4. **slug** (Short text, unique) - Required
5. **publishedDate** (Date & time) - Required
6. **author** (Short text) - Optional
7. **tags** (Short text, multiple) - Optional

## Test Your Setup

1. **After setting environment variables and redeploying:**
   - Visit: `https://life-bridge-ruby.vercel.app/test-contentful`
   - This page will show if everything is configured correctly

2. **Check build logs:**
   - Vercel → Deployments → Latest deployment → Build Logs
   - Look for `[Contentful]` messages
   - Should see: `[Contentful] Available content types: [...]`
   - Should see: `[Contentful] Found X blog posts`

3. **Publish a blog post in Contentful:**
   - Create a new entry in your "SOmthijng" content type
   - Fill in all required fields
   - Click **Publish**
   - The webhook should trigger a new deployment automatically
   - Check Vercel → Deployments to see the new deployment

## Troubleshooting

### If blog posts still don't show:

1. **Check the test page:** `/test-contentful` - shows if env vars are set
2. **Check build logs** for `[Contentful]` messages
3. **Verify content type API identifier:**
   - Contentful → Content model → Click "SOmthijng"
   - Check what the **API identifier** is (might be different from display name)
   - The code will try to auto-detect it, but check build logs to see what it finds

### Common Issues:

- **"Not configured"** in logs = Environment variables not set in Vercel
- **"No posts found"** = Content type name mismatch or no published posts
- **401/403 errors** = Wrong access token (make sure it's Content Delivery API, not Management API)

