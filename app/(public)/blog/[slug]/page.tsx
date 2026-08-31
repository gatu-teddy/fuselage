import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS, getPost } from "@/lib/blog-posts";
import { c } from "@/lib/tokens";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | TrueWagon`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px" }}>
      {/* Back */}
      <Link
        href="/blog"
        style={{ color: c.muted, fontSize: "13px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "32px" }}
      >
        ← All guides
      </Link>

      {/* Meta */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span style={{ backgroundColor: c.greenBg, color: c.greenText, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px" }}>
          {post.category}
        </span>
        <span style={{ color: c.muted, fontSize: "12px" }}>{post.readingTime}</span>
        <span style={{ color: c.muted, fontSize: "12px" }}>·</span>
        <span style={{ color: c.muted, fontSize: "12px" }}>
          {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Title */}
      <h1 style={{ color: c.primary, fontSize: "28px", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.4px", marginBottom: "20px" }}>
        {post.title}
      </h1>
      <p style={{ color: c.muted, fontSize: "16px", lineHeight: 1.6, marginBottom: "40px", borderBottom: `1px solid ${c.border}`, paddingBottom: "32px" }}>
        {post.description}
      </p>

      {/* Content */}
      <div style={{ fontSize: "15px", lineHeight: 1.75, color: c.body }}>
        {post.content.map((section, i) => {
          if (section.type === "h2") {
            return (
              <h2
                key={i}
                style={{ color: c.primary, fontSize: "20px", fontWeight: 700, marginTop: "40px", marginBottom: "12px", letterSpacing: "-0.2px" }}
              >
                {section.text}
              </h2>
            );
          }
          if (section.type === "p") {
            return (
              <p key={i} style={{ marginBottom: "18px", color: c.body }}>
                {section.text}
              </p>
            );
          }
          if (section.type === "ul") {
            return (
              <ul key={i} style={{ paddingLeft: "20px", marginBottom: "18px" }}>
                {section.items?.map((item, j) => (
                  <li key={j} style={{ marginBottom: "10px", color: c.body }}>
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          if (section.type === "ol") {
            return (
              <ol key={i} style={{ paddingLeft: "20px", marginBottom: "18px" }}>
                {section.items?.map((item, j) => (
                  <li key={j} style={{ marginBottom: "10px", color: c.body }}>
                    {item}
                  </li>
                ))}
              </ol>
            );
          }
          if (section.type === "cta") {
            return (
              <div
                key={i}
                style={{
                  backgroundColor: c.greenBg,
                  border: `1px solid ${c.green}30`,
                  borderRadius: "12px",
                  padding: "24px 28px",
                  marginTop: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <p style={{ color: c.greenText, fontWeight: 600, fontSize: "15px", margin: 0 }}>
                  Ready to buy safely?
                </p>
                <Link
                  href={section.ctaHref ?? "/browse"}
                  style={{
                    backgroundColor: c.primary,
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  {section.ctaText ?? "Browse listings →"}
                </Link>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Footer nav */}
      <div style={{ marginTop: "60px", paddingTop: "32px", borderTop: `1px solid ${c.border}` }}>
        <p style={{ color: c.muted, fontSize: "13px", marginBottom: "16px" }}>More guides</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              style={{ color: c.primary, fontSize: "14px", fontWeight: 500, textDecoration: "none" }}
            >
              → {p.title}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
