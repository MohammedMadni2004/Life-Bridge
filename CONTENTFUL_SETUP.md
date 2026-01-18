# Contentful CMS Setup Guide

This guide will help you set up Contentful CMS for your blog posts.

## Step 1: Create a Contentful Account

1. Go to [contentful.com](https://www.contentful.com) and sign up for a free account
2. Create a new space (or use an existing one)

## Step 2: Create Content Type

1. In your Contentful space, go to **Content model**
2. Click **Add content type**
3. Name it `Blog Post` (the API ID will be `blogPost`)
4. Add the following fields:

### Fields to Add:

1. **Title** (Short text)
   - Field ID: `title`
   - Required: Yes
   - Help text: "Blog post title"

2. **Description** (Short text)
   - Field ID: `description`
   - Required: Yes
   - Help text: "Brief description of the blog post"

3. **Content** (Long text)
   - Field ID: `content`
   - Required: Yes
   - Help text: "Main blog post content (supports Markdown)"

4. **Author** (Short text)
   - Field ID: `author`
   - Required: No
   - Default value: "LifeBridge Guidance"
   - Help text: "Author name"

5. **Published Date** (Date & time)
   - Field ID: `publishedDate`
   - Required: Yes
   - Help text: "Publication date"

6. **Tags** (Short text, list)
   - Field ID: `tags`
   - Required: No
   - Help text: "Tags for categorization"

7. **Slug** (Short text, unique)
   - Field ID: `slug`
   - Required: Yes
   - Help text: "URL-friendly identifier (e.g., 'essential-things-widow-widower')"
   - Validation: Unique

## Step 3: Get API Credentials

1. Go to **Settings** → **API keys**
2. Copy your **Space ID**
3. Copy your **Content Delivery API access token**

## Step 4: Set Environment Variables

Create a `.env` file in your project root:

```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

**Important:** Add `.env` to your `.gitignore` file to keep your credentials secure!

## Step 5: Add Your Blog Posts

Based on your docx files, here are the three blog posts to create:

### Blog Post 1:
- **Title:** 6 Essential Things Every Widow or Widower Should Know
- **Slug:** `6-essential-things-widow-widower-should-know`
- **Description:** Essential guidance for widows and widowers navigating life after loss
- **Tags:** guidance, widow, widower, essentials
- **Content:** [Copy content from the docx file]

### Blog Post 2:
- **Title:** Step by Step Checklist
- **Slug:** `step-by-step-checklist`
- **Description:** A comprehensive checklist to help you navigate the practical steps after loss
- **Tags:** checklist, steps, guidance
- **Content:** [Copy content from the docx file]

### Blog Post 3:
- **Title:** What to Do When a Spouse Dies and They Have Accounts at Fidelity
- **Slug:** `spouse-dies-fidelity-accounts`
- **Description:** Practical steps for handling Fidelity accounts after the loss of a spouse
- **Tags:** fidelity, accounts, financial, spouse
- **Content:** [Copy content from the docx file]

## Step 6: Extract Content from Docx Files

To extract content from your docx files:

### Option 1: Manual (Easiest)
1. Open each docx file in Microsoft Word or Google Docs
2. Copy the content
3. Paste into Contentful's Content field
4. Format using Markdown if needed

### Option 2: Using Mammoth (Node.js)
```bash
npm install mammoth
```

Then create a script to convert docx to markdown.

### Option 3: Online Converter
Use an online docx to markdown converter like:
- [CloudConvert](https://cloudconvert.com/docx-to-md)
- [Zamzar](https://www.zamzar.com/convert/docx-to-md/)

## Step 7: Install Dependencies

Run:
```bash
npm install
```

This will install:
- `contentful` - Contentful SDK
- `marked` - Markdown to HTML converter

## Step 8: Test Your Setup

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:4321/blog`
3. You should see your blog posts listed
4. Click on a post to view the full content

## Troubleshooting

### No blog posts showing?
- Check your environment variables are set correctly
- Verify your Content Type is named `blogPost` (exact match)
- Make sure your blog posts are published in Contentful
- Check browser console for errors

### API Errors?
- Verify your Space ID and Access Token are correct
- Check that you're using the Content Delivery API token (not Management API)

## Next Steps

Once set up, you can:
- Add new blog posts directly in Contentful
- No code changes needed for new posts
- Content updates automatically on rebuild
- Use Contentful's preview features for drafts

