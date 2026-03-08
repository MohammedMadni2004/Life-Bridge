# Fix: Webhook Not Triggering on Blog Post Publish

## The Problem

Your webhook is only set to trigger on **Content type** changes, but when you publish a blog post, that's an **Entry** event. So the webhook doesn't fire.

## The Solution

You need to enable triggers for **Entry** (not just Content type).

## Step-by-Step Fix

1. **Go to Contentful Webhook Settings:**
   - Contentful → **Settings** → **Webhooks**
   - Click on your "Vercel Rebuild" webhook
   - Click the **"Webhook settings"** tab (or go to the settings page)

2. **In the "Content Events" table, find the "Entry" row**

3. **Check these boxes in the "Entry" row:**
   - ✅ **Publish** (most important!)
   - ✅ **Unpublish** (optional, but recommended)
   - ✅ **Create** (optional - triggers when you create a new entry)
   - ✅ **Save** (optional - triggers when you save changes)

4. **Your current setup shows:**
   - ✅ Content type → Publish (checked)
   - ✅ Content type → Unpublish (checked)
   - ❌ Entry → Publish (NOT checked) ← **THIS IS THE PROBLEM!**
   - ❌ Entry → Unpublish (NOT checked)

5. **What you need:**
   - ✅ Content type → Publish (keep this)
   - ✅ Content type → Unpublish (keep this)
   - ✅ **Entry → Publish** ← **CHECK THIS!**
   - ✅ **Entry → Unpublish** ← **CHECK THIS!**

6. **Click "Save"** at the top right

## Visual Guide

In the Content Events table:

```
                    Create  Save  Publish  Unpublish  Delete
Content type        [ ]     [ ]   [✓]      [✓]        [ ]
Entry               [ ]     [ ]   [✓] ← CHECK THIS!  [✓] ← AND THIS!
Asset               [ ]     [ ]   [ ]      [ ]        [ ]
```

## After Fixing

1. **Save the webhook settings**
2. **Publish a test blog post** in Contentful
3. **Check the Activity log** - you should see a new webhook call
4. **Check Vercel** - a new deployment should be triggered automatically

## Why This Happens

- **Content type** events = When you modify the content model (add/remove fields)
- **Entry** events = When you create/edit/publish actual blog posts
- You need **Entry** triggers to catch blog post publishes!

## Test It

After enabling Entry → Publish:
1. Go to Contentful → Content
2. Edit any blog post
3. Click **Publish**
4. Check Contentful → Settings → Webhooks → Your webhook → Activity log
5. You should see a new entry with HTTP 201
6. Check Vercel → Deployments - should see a new deployment starting

