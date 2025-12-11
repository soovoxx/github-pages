import type { Post } from "../types";
import { POSTS_PER_PAGE } from "../constants";

export type PostSummary = {
  title: string;
  summary: string;
  date: Date;
  slug: string;
  image?: string;
  tags: string[];
};

// Ensures a time component exists so sorting can consider hh:mm:ss.
export const parsePubDate = (raw: string): Date => {
  const trimmed = raw.trim();
  const hasTime = /\d{2}:\d{2}(:\d{2})?/.test(trimmed);
  const withTime = hasTime ? trimmed : `${trimmed} 00:00:00`;
  const isoReady = withTime.includes("T") ? withTime : withTime.replace(" ", "T");
  return new Date(isoReady);
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
      date: parsePubDate(post.frontmatter.pubDate),
      slug: post.frontmatter.slug,
      image: post.frontmatter.thumbnail,
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
