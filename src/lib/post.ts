import type { Post } from "@/types";
import { POSTS_PER_PAGE } from "@/constants";

export type PostSummary = {
  title: string;
  summary: string;
  date: Date;
  slug: string;
  image?: string;
  tags: string[];
  category?: string;
  series?: string;
};

export const getPostEntries = (): Post[] =>
  Object.values(
    import.meta.glob("@/content/posts/*.{md,mdx}", { eager: true }),
  );

// Ensures a time component exists so sorting can consider hh:mm:ss.
export const parsePubDate = (raw: string): Date => {
  const trimmed = raw.trim();
  const hasTime = /\d{2}:\d{2}(:\d{2})?/.test(trimmed);
  const withTime = hasTime ? trimmed : `${trimmed} 00:00:00`;
  const isoReady = withTime.includes("T")
    ? withTime
    : withTime.replace(" ", "T");
  return new Date(isoReady);
};

export const getAllPosts = (): PostSummary[] => {
  const postEntries = getPostEntries();

  return postEntries
    .filter((post) => Boolean(post.frontmatter.slug))
    .map((post) => ({
      title: post.frontmatter.title,
      summary: post.frontmatter.summary || "",
      date: parsePubDate(post.frontmatter.pubDate),
      slug: post.frontmatter.slug,
      image: post.frontmatter.thumbnail,
      category: post.frontmatter.category,
      series: post.frontmatter.series,
      tags: post.frontmatter.tags || [],
    }))
    .sort((a, b) => Number(b.date) - Number(a.date));
};

export const slugifySeries = (name: string): string =>
  encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, "-"));

export type SeriesGroup = {
  name: string;
  slug: string;
  posts: PostSummary[];
};

export const getSeriesGroups = (): SeriesGroup[] => {
  const posts = getAllPosts();
  const map = new Map<string, SeriesGroup>();

  posts.forEach((post) => {
    if (!post.series) return;
    const name = post.series.trim();
    if (!name) return;
    const slug = slugifySeries(name);
    const existing = map.get(slug);
    if (existing) {
      existing.posts.push(post);
    } else {
      map.set(slug, { name, slug, posts: [post] });
    }
  });

  return Array.from(map.values()).map((group) => ({
    ...group,
    posts: group.posts.sort((a, b) => Number(b.date) - Number(a.date)),
  }));
};

export const getPaginationMeta = (
  totalItems: number,
  pageSize = POSTS_PER_PAGE,
) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return { totalPages };
};

const normalizeSeries = (name?: string | null): string =>
  (name ?? "").trim().toLowerCase();

export const getAdjacentPosts = (
  slug: string,
  seriesName?: string,
): {
  prevPost?: PostSummary;
  nextPost?: PostSummary;
  isSeriesScoped: boolean;
} => {
  const allPosts = getAllPosts();
  const requestedSeries = normalizeSeries(seriesName);

  const list =
    requestedSeries.length > 0
      ? allPosts.filter(
          (post) => normalizeSeries(post.series) === requestedSeries,
        )
      : allPosts;

  const currentIndex = list.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex >= 0 ? list[currentIndex + 1] : undefined; // older
  const nextPost = currentIndex > 0 ? list[currentIndex - 1] : undefined; // newer

  return {
    prevPost,
    nextPost,
    isSeriesScoped: requestedSeries.length > 0,
  };
};
