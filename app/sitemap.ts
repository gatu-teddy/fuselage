import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fuselage.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${BASE}/browse`,         lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/sellers`,        lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/blog`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/partners`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/pricing`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/how-it-works`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/support`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...blogRoutes];
}
