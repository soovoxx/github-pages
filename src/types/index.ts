import type { MarkdownInstance } from "astro";

interface PostFrontmatter {
  title: string;
  slug: string;
  pubDate: string;
  tags: string[];
  summary: string;
  category?: string;
  series?: string;
  description?: string;
  thumbnail?: string;
}

// Astro Markdown files export frontmatter fields both under `frontmatter`
// and as named exports, so we intersect them with MarkdownInstance.
export type Post = MarkdownInstance<PostFrontmatter>;
