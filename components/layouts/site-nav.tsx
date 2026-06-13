"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav } from "@/components/layouts/auth-nav";
import { c } from "@/lib/tokens";

const NAV_LINKS = [
  { label: "Browse",          href: "/browse"        },
  { label: "Vetting Process", href: "/#services"     },
  { label: "How It Works",    href: "/#process"      },
  { label: "Destinations",    href: "/#destinations" },
  { label: "Pricing",         href: "/pricing"       },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        backgroundColor: "rgba(255,255,255,0.97)",
        borderBottom: `1px solid ${c.border}`,
        fontFamily: "Inter, sans-serif",
      }}
      className="sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: c.primary }}
            className="w-7 h-7 rounded flex items-center justify-center"
          >
            <span className="text-white font-black text-xs">T</span>
          </div>
          <span style={{ color: c.primary }} className="font-bold text-lg tracking-tight">
            TrueWagon
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => {
            // Mark active: exact match for static pages, prefix match for sections
            const isActive = href.startsWith("/") && !href.includes("#")
              ? pathname === href
              : false;
            return (
              <Link
                key={label}
                href={href}
                style={{
                  color: isActive ? c.primary : c.body,
                  fontWeight: isActive ? "600" : "500",
                }}
                className="text-sm hover:opacity-70 transition-opacity"
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth-aware right side + mobile hamburger */}
        <AuthNav />
      </div>
    </nav>
  );
}
