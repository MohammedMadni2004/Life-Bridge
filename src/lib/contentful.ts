import contentful from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { blogPosts as localBlogPosts, type BlogPost } from "../constants";

const { createClient } = contentful;

/** Escape HTML so plain text can be safely used inside HTML. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Turn plain text into HTML. One newline = new paragraph; ## / # = headings. */
function plainTextToHtml(text: string): string {
  if (!text || typeof text !== "string") return "";
  const trimmed = text.trim();
  const paragraphs = trimmed.split(/\n/).map((p) => p.trim()).filter((p) => p.length > 0);
  if (paragraphs.length === 0) return "";
  return paragraphs
    .map((p) => {
      if (p.startsWith("## ")) {
        return `<h2 class="mt-8 mb-3">${escapeHtml(p.slice(3))}</h2>`;
      }
      if (p.startsWith("# ")) {
        return `<h1 class="mt-8 mb-3">${escapeHtml(p.slice(2))}</h1>`;
      }
      return `<p class="mb-6">${escapeHtml(p)}</p>`;
    })
    .join("");
}

/**
 * Convert Contentful content (Rich Text object or plain string) to HTML.
 * Ensures all content is rendered and no blocks are dropped.
 */
function contentToHtml(content: any): string {
  if (content == null) return "";
  if (typeof content === "string") return plainTextToHtml(content);
  if (typeof content !== "object") return "";
  // Rich Text document: use official renderer so nothing is lost
  try {
    if (content.nodeType === "document" && Array.isArray(content.content)) {
      return documentToHtmlString(content);
    }
    // Some APIs wrap the document
    if (content.nodeType && content.content) return documentToHtmlString(content);
  } catch (e) {
    console.warn("[Contentful] Rich text to HTML failed, falling back to text extraction:", e);
  }
  return plainTextToHtml(extractTextFromRichText(content));
}

// Export BlogPost type
export type { BlogPost };

/** Convert any string to a URL-safe slug (lowercase, hyphens, no spaces). */
export function slugify(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Helper function to extract text from Contentful Rich Text objects
function extractTextFromRichText(content: any): string {
  if (!content) return '';
  
  // If it's already a string, return it
  if (typeof content === 'string') {
    return content;
  }
  
  // If it's not an object, return empty string
  if (typeof content !== 'object' || content === null) {
    return '';
  }
  
  // Recursive function to extract text from Rich Text structure
  const extractText = (node: any): string => {
    if (!node) return '';
    
    // If it's a text node, return its value
    if (node.nodeType === 'text' || node.nodeType === 'TEXT') {
      return node.value || '';
    }
    
    // If it has a value property (some formats)
    if (node.value && typeof node.value === 'string') {
      return node.value;
    }
    
    // If it has content array, recursively process
    if (node.content && Array.isArray(node.content)) {
      const extracted = node.content.map(extractText).filter((t: string) => t.length > 0);
      // Add line breaks for paragraphs
      if (node.nodeType === 'paragraph' || node.nodeType === 'PARAGRAPH') {
        return extracted.join('\n\n');
      }
      return extracted.join(' ');
    }
    
    // If it's an array, process each item
    if (Array.isArray(node)) {
      return node.map(extractText).filter((t: string) => t.length > 0).join(' ');
    }
    
    // If it's a document type, look for content
    if (node.nodeType === 'document' || node.nodeType === 'DOCUMENT') {
      if (node.content) {
        return extractText(node.content);
      }
    }
    
    // For paragraph, heading, etc., extract their content
    if (node.nodeType && node.content) {
      return extractText(node.content);
    }
    
    return '';
  };
  
  // Try to extract text from the object
  const extracted = extractText(content);
  
  // If extraction failed, log and return empty
  if (!extracted || extracted.trim() === '') {
    console.warn("[Contentful] Could not extract text from Rich Text content object");
    console.warn("[Contentful] Content structure:", JSON.stringify(content).substring(0, 200));
    return '';
  }
  
  return extracted;
}

// Check if Contentful is configured
// Try both public and private env var access patterns
const spaceId = import.meta.env.CONTENTFUL_SPACE_ID || import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.CONTENTFUL_ACCESS_TOKEN || import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const isContentfulConfigured = spaceId && accessToken;

// Log configuration status (will show in build logs)


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
        limit: 1000, // Get all posts (Contentful default is 100)
      });

      console.log("[Contentful] ✅ Found", entries.items.length, "blog posts");
      
      if (entries.items.length === 0) {
        console.warn("[Contentful] ⚠️ No blog posts found in Contentful!");
        console.warn("[Contentful] ⚠️ Make sure:");
        console.warn("[Contentful]   1. You have published entries in your content type");
        console.warn("[Contentful]   2. The content type name matches (tried:", contentTypeToUse, ")");
      }

      const contentfulPosts = entries.items.map((item: any) => {
        // Ensure tags is always an array
        let tags = item.fields.tags || [];
        if (!Array.isArray(tags)) {
          // If tags is a string, convert to array
          if (typeof tags === 'string') {
            tags = tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
          } else {
            tags = [];
          }
        }
        
        // Handle content field: Rich Text or string → HTML so nothing is dropped
        const content = contentToHtml(item.fields.content);
        
        const rawSlug = item.fields.slug || item.fields.title || "";
        return {
          title: item.fields.title || "",
          description: item.fields.description || "",
          content: content,
          author: item.fields.author || "LifeBridge Guidance",
          publishedDate: item.fields.publishedDate || new Date().toISOString(),
          tags: tags,
          slug: slugify(rawSlug),
        };
      });

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
      
      // Try exact slug match first (e.g. "spouse-dies-fidelity-accounts")
      let entries = await client.getEntries({
        content_type: contentTypeToUse,
        "fields.slug": slug,
        limit: 1,
      });

      // If no exact match, fetch all and find by URL-safe slug (handles Contentful slugs with spaces)
      if (entries.items.length === 0) {
        const allEntries = await client.getEntries({
          content_type: contentTypeToUse,
          limit: 500,
        });
        const match = allEntries.items.find((entry: any) => slugify(entry.fields?.slug || entry.fields?.title || "") === slug);
        if (match) entries = { ...allEntries, items: [match] };
      }

      if (entries.items.length > 0) {
        console.log("[Contentful] Found blog post:", (entries.items[0] as any).fields.title);
        const item = entries.items[0] as any;
        
        // Ensure tags is always an array
        let tags = item.fields.tags || [];
        if (!Array.isArray(tags)) {
          // If tags is a string, convert to array
          if (typeof tags === 'string') {
            tags = tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
          } else {
            tags = [];
          }
        }
        
        // Handle content field: Rich Text or string → HTML so nothing is dropped
        const content = contentToHtml(item.fields.content);
        
        const rawSlug = item.fields.slug || item.fields.title || "";
        return {
          title: item.fields.title || "",
          description: item.fields.description || "",
          content: content,
          author: item.fields.author || "LifeBridge Guidance",
          publishedDate: item.fields.publishedDate || new Date().toISOString(),
          tags: tags,
          slug: slugify(rawSlug),
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

  // Return local blog post from constants (match by slug or slugified slug)
  const local = localBlogPosts.find((post) => post.slug === slug || slugify(post.slug) === slug);
  if (local) {
    return { ...local, content: plainTextToHtml(local.content) };
  }
  return null;
}
