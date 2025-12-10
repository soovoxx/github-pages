import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { posts };
