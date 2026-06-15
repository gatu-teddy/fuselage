"use client";
import { useEffect, useState } from "react";
import { c } from "@/lib/tokens";

interface TocItem {
  id: string;
  label: string;
}

interface Props {
  items: TocItem[];
}

export function TocNav({ items }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Build a map of element -> id for fast lookup
    const elements = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when a heading reaches ~20% from the top of the viewport
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // Fallback: highlight whichever section is nearest the top on scroll
  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY + 120; // offset for sticky nav
      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveId(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {items.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            style={{
              display: "block",
              color: isActive ? c.blue : c.muted,
              fontSize: "12px",
              fontWeight: isActive ? 600 : 400,
              textDecoration: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              lineHeight: 1.4,
              backgroundColor: isActive ? c.blueBg : "transparent",
              borderLeft: isActive ? `2px solid ${c.blue}` : "2px solid transparent",
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}
