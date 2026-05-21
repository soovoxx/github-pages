import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
    category: z.string().optional(),
    series: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { posts };
