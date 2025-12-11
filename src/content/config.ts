import { defineCollection, z } from "astro:content";

const posts = defineCollection({
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
