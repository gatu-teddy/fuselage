import Link from "next/link";
import { c } from "@/lib/tokens";

const FOOTER_LINKS = [
  { label: "Privacy",  href: "/privacy"  },
  { label: "Terms",    href: "/terms"    },
  { label: "Support",  href: "/support"  },
  { label: "Browse",   href: "/browse"   },
  { label: "Pricing",  href: "/pricing"  },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: c.surface,
        borderTop: `1px solid ${c.border}`,
        fontFamily: "Inter, sans-serif",
      }}
      className="py-10"
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: c.primary }}
            className="w-6 h-6 rounded flex items-center justify-center"
          >
            <span className="text-white font-black text-xs">T</span>
          </div>
          <span style={{ color: c.primary }} className="font-bold text-sm">TrueWagon</span>
          <span style={{ color: c.muted }} className="text-sm">© 2026</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{ color: c.muted }}
              className="text-sm hover:text-[#0F172A] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div style={{ color: c.muted }} className="text-xs text-center md:text-right">
          logistics@truewagon.com
        </div>
      </div>
    </footer>
  );
}
