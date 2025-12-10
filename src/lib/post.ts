import type { Post } from "../types";
import { POSTS_PER_PAGE } from "../constants";

export type PostSummary = {
  title: string;
  summary: string;
  date: Date;
  slug: string;
  tags: string[];
};

export const getAllPosts = (): PostSummary[] => {
  const postEntries: Post[] = Object.values(
    import.meta.glob("../content/posts/*.md", { eager: true })
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

export const getPaginationMeta = (
  totalItems: number,
  pageSize = POSTS_PER_PAGE
) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return { totalPages };
};

export const getAdjacentPosts = (
  slug: string
): { prevPost?: PostSummary; nextPost?: PostSummary } => {
  const allPosts = getAllPosts();

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex >= 0 ? allPosts[currentIndex + 1] : undefined; // older
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined; // newer

  return { prevPost, nextPost };
};
