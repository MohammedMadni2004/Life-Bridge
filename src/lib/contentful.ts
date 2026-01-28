import contentful from "contentful";
import { blogPosts as localBlogPosts, type BlogPost } from "../constants";

const { createClient } = contentful;

// Export BlogPost type
export type { BlogPost };

// Check if Contentful is configured
const isContentfulConfigured =
  import.meta.env.CONTENTFUL_SPACE_ID &&
  import.meta.env.CONTENTFUL_ACCESS_TOKEN;

// Create Contentful client only if configured
let client: ReturnType<typeof createClient> | null = null;

if (isContentfulConfigured) {
  client = createClient({
    space: import.meta.env.CONTENTFUL_SPACE_ID!,
    accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN!,
  });
}

// Get all blog posts - tries Contentful first, falls back to local JSON
export async function getBlogPosts(): Promise<BlogPost[]> {
  // If Contentful is configured, try to fetch from there
  if (isContentfulConfigured && client) {
    try {
      console.log("[Contentful] Attempting to fetch blog posts...");
      console.log("[Contentful] Space ID:", import.meta.env.CONTENTFUL_SPACE_ID ? "Set" : "Missing");
      console.log("[Contentful] Access Token:", import.meta.env.CONTENTFUL_ACCESS_TOKEN ? "Set" : "Missing");
      
      const entries = await client.getEntries({
        content_type: "blogPost",
        order: ["-fields.publishedDate"],
      });

      console.log("[Contentful] Found", entries.items.length, "blog posts");

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
    console.log("[Contentful] Space ID configured:", !!import.meta.env.CONTENTFUL_SPACE_ID);
    console.log("[Contentful] Access Token configured:", !!import.meta.env.CONTENTFUL_ACCESS_TOKEN);
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
      const entries = await client.getEntries({
        content_type: "blogPost",
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
