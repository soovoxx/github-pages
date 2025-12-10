import type { Post } from "../types";

export type PostSummary = {
  title: string;
  summary: string;
  date: Date;
  slug: string;
  tags: string[];
};

export const PAGE_SIZE = 10;

export const getAllPosts = (): PostSummary[] => {
  const postEntries: Post[] = Object.values(
    import.meta.glob("../post/*.md", { eager: true })
  );

  return postEntries
    .filter((post) => Boolean(post.frontmatter.slug))
    .map((post) => ({
      title: post.frontmatter.title,
      summary: post.frontmatter.summary || "",
      date: new Date(post.frontmatter.pubDate),
      slug: post.frontmatter.slug,
      tags: post.frontmatter.tags || [],
    }))
    .sort((a, b) => Number(b.date) - Number(a.date));
};

export const getPaginationMeta = (totalItems: number, pageSize: number) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return { totalPages };
};
