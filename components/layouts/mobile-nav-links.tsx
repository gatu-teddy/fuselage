"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const c = {
  primary: "#0F172A",
  green:   "#10B981",
  body:    "#334155",
  border:  "#E2E8F0",
  muted:   "#64748B",
};

const navLinks = [
  { label: "Browse",          href: "/browse"       },
  { label: "Vetting Process", href: "/#services"    },
  { label: "How It Works",    href: "/how-it-works" },
  { label: "Destinations",    href: "/#destinations"},
];

export function MobileNavLinks() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded"
        style={{ color: c.primary }}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open
          ? <X style={{ width: "20px", height: "20px" }} />
          : <Menu style={{ width: "20px", height: "20px" }} />
        }
      </button>

      {/* Full-width dropdown — mobile only */}
      {open && (
        <div
          className="md:hidden absolute top-16 left-0 right-0 z-50"
          style={{
            backgroundColor: "#fff",
            borderBottom: `1px solid ${c.border}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <nav style={{ padding: "12px 0" }}>
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 20px",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: c.body,
                  textDecoration: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {label}
              </Link>
            ))}
            <div style={{ borderTop: `1px solid ${c.border}`, margin: "8px 0" }} />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "12px 20px",
                fontSize: "15px",
                fontWeight: 500,
                color: c.body,
                textDecoration: "none",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Sign In
            </Link>
            <div style={{ padding: "8px 20px 16px" }}>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  textAlign: "center",
                  backgroundColor: c.primary,
                  color: "#fff",
                  padding: "10px 0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
