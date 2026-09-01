import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { c } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Import Guides & Buyer Resources | TrueWagon",
  description:
    "Practical guides on importing motorcycles from Japan to East Africa — documentation, freight, verification, and how to avoid scams.",
};

export default function BlogPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
      <style>{`
        .blog-card { transition: border-color 0.15s, box-shadow 0.15s; }
        .blog-card:hover { border-color: #0F172A !important; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      `}</style>

      <h1 style={{ color: c.primary, fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "8px" }}>
        Import Guides
      </h1>
      <p style={{ color: c.muted, fontSize: "16px", marginBottom: "48px" }}>
        Practical resources for buying motorcycles from Japan and shipping to East Africa.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
            <article
              className="blog-card"
              style={{
                backgroundColor: "#fff",
                border: `1px solid ${c.border}`,
                borderRadius: "12px",
                padding: "28px 32px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ backgroundColor: c.greenBg, color: c.greenText, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px" }}>
                  {post.category}
                </span>
                <span style={{ color: c.muted, fontSize: "12px" }}>{post.readingTime}</span>
              </div>
              <h2 style={{ color: c.primary, fontSize: "18px", fontWeight: 700, lineHeight: 1.35, marginBottom: "8px" }}>
                {post.title}
              </h2>
              <p style={{ color: c.muted, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                {post.description}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
