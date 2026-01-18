# Blog Setup - Quick Start Guide

Your blog is now set up! Blog posts are stored in `src/constants/blogPosts.ts` and can optionally use Contentful CMS.

## ✅ What's Been Set Up

1. ✅ Blog posts stored in `src/constants/blogPosts.ts`
2. ✅ Blog listing page (`/blog`)
3. ✅ Individual blog post pages (`/blog/[slug]`)
4. ✅ Navigation links added to homepage
5. ✅ Markdown support for blog content
6. ✅ Responsive design matching your site theme
7. ✅ Optional Contentful CMS integration (falls back to local posts)

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This installs:

- `contentful` - Contentful SDK (optional, only if using Contentful)
- `marked` - Markdown to HTML converter

### Step 2: Add Your Blog Content

Edit `src/constants/blogPosts.ts` and replace the placeholder content with your actual blog content from the docx files:

1. **6 Essential Things Every Widow or Widower Should Know**

   - Open the docx file
   - Copy the content
   - Paste into the `content` field in `blogPosts.ts`
   - Format using Markdown

2. **Step by Step Checklist**

   - Same process as above

3. **What to Do When a Spouse Dies and They Have Accounts at Fidelity**
   - Same process as above

The blog posts are already structured with:

- ✅ Titles
- ✅ Slugs (URL-friendly)
- ✅ Descriptions
- ✅ Tags
- ✅ Author
- ✅ Published dates

You just need to replace the placeholder `content` fields with your actual content.

## 📝 Blog Post Structure

Each blog post in `src/constants/blogPosts.ts` has:

```typescript
{
  title: "Your Blog Title",
  slug: "url-friendly-slug",
  description: "Brief description",
  author: "LifeBridge Guidance",
  publishedDate: "2024-01-15T00:00:00.000Z",
  tags: ["tag1", "tag2"],
  content: `# Your Markdown Content Here`
}
```

## 🎯 Testing

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:4321/blog`
3. You should see your 3 blog posts listed
4. Click any post to view full content

## 📍 Routes Created

- `/blog` - Lists all blog posts
- `/blog/[slug]` - Individual blog post page (dynamic)

## 🔧 How It Works

1. **Primary Source**: Blog posts are stored in `src/constants/blogPosts.ts`
2. **Contentful (Optional)**: If you set up Contentful with environment variables, it will try to fetch from Contentful first, then fall back to local posts
3. **Markdown**: Content is converted to HTML using `marked`
4. **Slugs**: Used for clean URLs (e.g., `/blog/6-essential-things-widow-widower-should-know`)

## 🎨 Features

- ✅ Responsive design matching your site
- ✅ Markdown support in blog content
- ✅ Tag system for categorization
- ✅ Author and date display
- ✅ SEO-friendly URLs with slugs
- ✅ Mobile-friendly navigation
- ✅ Easy to add new posts (just add to the array)

## 📚 Optional: Contentful Setup

If you want to use Contentful CMS instead of (or in addition to) the local JSON file:

1. See `CONTENTFUL_SETUP.md` for detailed instructions
2. Create `.env` file with your Contentful credentials
3. The system will automatically use Contentful if configured, otherwise use local posts

## 🆘 Troubleshooting

**No posts showing?**

- Check `src/constants/blogPosts.ts` has content
- Verify the blog posts array is not empty
- Check browser console for errors

**Build errors?**

- Make sure `npm install` completed successfully
- Verify `marked` package is installed
