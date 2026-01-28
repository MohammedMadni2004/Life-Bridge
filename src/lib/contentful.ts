import contentful from "contentful";
import { blogPosts as localBlogPosts, type BlogPost } from "../constants";

const { createClient } = contentful;

// Export BlogPost type
export type { BlogPost };

// Check if Contentful is configured
// Try both public and private env var access patterns
const spaceId = import.meta.env.CONTENTFUL_SPACE_ID || import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.CONTENTFUL_ACCESS_TOKEN || import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const isContentfulConfigured = spaceId && accessToken;

// Log configuration status (will show in build logs)
if (typeof process !== 'undefined' && process.env) {
  console.log("[Contentful Config Check]");
  console.log("[Contentful Config Check] Space ID exists:", !!spaceId);
  console.log("[Contentful Config Check] Access Token exists:", !!accessToken);
  console.log("[Contentful Config Check] Is configured:", isContentfulConfigured);
}

// Create Contentful client only if configured
let client: ReturnType<typeof createClient> | null = null;

if (isContentfulConfigured) {
  client = createClient({
    space: spaceId!,
    accessToken: accessToken!,
  });
  console.log("[Contentful] Client created successfully");
} else {
  console.warn("[Contentful] ⚠️ Contentful is NOT configured!");
  console.warn("[Contentful] Space ID:", spaceId ? "Found" : "MISSING");
  console.warn("[Contentful] Access Token:", accessToken ? "Found" : "MISSING");
  console.warn("[Contentful] Will use local blog posts instead");
}

// Get all blog posts - tries Contentful first, falls back to local JSON
export async function getBlogPosts(): Promise<BlogPost[]> {
  // If Contentful is configured, try to fetch from there
  if (isContentfulConfigured && client) {
    try {
      console.log("[Contentful] Attempting to fetch blog posts...");
      console.log("[Contentful] Space ID:", spaceId ? "Set" : "Missing");
      console.log("[Contentful] Access Token:", accessToken ? "Set" : "Missing");
      
      // First, try to get all content types to see what's available
      let contentTypeToUse = "blogPost"; // Default
      try {
        console.log("[Contentful] Fetching available content types...");
        const allContentTypes = await client.getContentTypes();
        const availableTypes = allContentTypes.items.map((t: any) => t.sys.id);
        console.log("[Contentful] ✅ Available content types:", availableTypes);
        
        // Try to find a matching content type
        const possibleNames = ["blogPost", "SOmthijng", "blog-post", "BlogPost", "blog_post"];
        for (const name of possibleNames) {
          if (availableTypes.includes(name)) {
            contentTypeToUse = name;
            console.log(`[Contentful] ✅ Found matching content type: "${name}"`);
            break;
          }
        }
        
        // If no match found, use the first available type (for debugging)
        if (!availableTypes.includes(contentTypeToUse) && availableTypes.length > 0) {
          console.warn(`[Contentful] ⚠️ Content type "blogPost" not found. Available types:`, availableTypes);
          console.warn(`[Contentful] ⚠️ Using first available type: "${availableTypes[0]}"`);
          contentTypeToUse = availableTypes[0];
        } else if (availableTypes.length === 0) {
          console.warn("[Contentful] ⚠️ No content types found in space!");
        }
      } catch (e: any) {
        console.error("[Contentful] ❌ Error fetching content types:", e.message);
        console.warn("[Contentful] ⚠️ Could not fetch content types list, using default 'blogPost'");
      }
      
      console.log(`[Contentful] Attempting to fetch entries with content type: "${contentTypeToUse}"`);
      const entries = await client.getEntries({
        content_type: contentTypeToUse,
        order: ["-fields.publishedDate"],
      });

      console.log("[Contentful] ✅ Found", entries.items.length, "blog posts");
      
      if (entries.items.length === 0) {
        console.warn("[Contentful] ⚠️ No blog posts found in Contentful!");
        console.warn("[Contentful] ⚠️ Make sure:");
        console.warn("[Contentful]   1. You have published entries in your content type");
        console.warn("[Contentful]   2. The content type name matches (tried:", contentTypeToUse, ")");
      }

      const contentfulPosts = entries.items.map((item: any) => ({
        title: item.fields.title || "",
        description: item.fields.description || "",
        content: item.fields.content || "",
        author: item.fields.author || "LifeBridge Guidance",
        publishedDate: item.fields.publishedDate || new Date().toISOString(),
        tags: item.fields.tags || [],
        slug: item.fields.slug || "",
      }));

      // If Contentful has posts, return them; otherwise fall back to local
      if (contentfulPosts.length > 0) {
        console.log("[Contentful] Returning", contentfulPosts.length, "posts from Contentful");
        return contentfulPosts;
      } else {
        console.log("[Contentful] No posts found, falling back to local posts");
      }
    } catch (error: any) {
      console.error("[Contentful] Error fetching blog posts:", error.message);
      console.error("[Contentful] Error details:", error);
      if (error.response) {
        console.error("[Contentful] Response status:", error.response.status);
        console.error("[Contentful] Response data:", error.response.data);
      }
      // Fall through to return local posts
    }
  } else {
    console.log("[Contentful] Not configured - using local blog posts");
    console.log("[Contentful] Space ID configured:", !!spaceId);
    console.log("[Contentful] Access Token configured:", !!accessToken);
    console.log("[Contentful] Make sure environment variables are set in Vercel:");
    console.log("[Contentful]   - CONTENTFUL_SPACE_ID");
    console.log("[Contentful]   - CONTENTFUL_ACCESS_TOKEN");
  }

  // Return local blog posts from constants
  return localBlogPosts.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

// Get a single blog post by slug - tries Contentful first, falls back to local JSON
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // If Contentful is configured, try to fetch from there
  if (isContentfulConfigured && client) {
    try {
      console.log("[Contentful] Fetching blog post with slug:", slug);
      
      // Get available content types to find the right one
      let contentTypeToUse = "blogPost";
      try {
        const allContentTypes = await client.getContentTypes();
        const availableTypes = allContentTypes.items.map((t: any) => t.sys.id);
        const possibleNames = ["blogPost", "SOmthijng", "blog-post", "BlogPost", "blog_post"];
        for (const name of possibleNames) {
          if (availableTypes.includes(name)) {
            contentTypeToUse = name;
            break;
          }
        }
        if (!availableTypes.includes(contentTypeToUse) && availableTypes.length > 0) {
          contentTypeToUse = availableTypes[0];
        }
      } catch (e) {
        // Use default
      }
      
      const entries = await client.getEntries({
        content_type: contentTypeToUse,
        "fields.slug": slug,
        limit: 1,
      });

      if (entries.items.length > 0) {
        console.log("[Contentful] Found blog post:", entries.items[0].fields.title);
        const item = entries.items[0] as any;
        return {
          title: item.fields.title || "",
          description: item.fields.description || "",
          content: item.fields.content || "",
          author: item.fields.author || "LifeBridge Guidance",
          publishedDate: item.fields.publishedDate || new Date().toISOString(),
          tags: item.fields.tags || [],
          slug: item.fields.slug || "",
        };
      } else {
        console.log("[Contentful] No blog post found with slug:", slug);
      }
    } catch (error: any) {
      console.error("[Contentful] Error fetching blog post:", error.message);
      if (error.response) {
        console.error("[Contentful] Response status:", error.response.status);
        console.error("[Contentful] Response data:", error.response.data);
      }
      // Fall through to check local posts
    }
  }

  // Return local blog post from constants
  return localBlogPosts.find((post) => post.slug === slug) || null;
}
