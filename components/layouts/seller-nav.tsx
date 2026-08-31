"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Bike, TrendingUp, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/seller/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/seller/listings",  label: "Listings",   icon: Bike },
  { href: "/seller/sales",     label: "Sales",      icon: TrendingUp },
];

import { c } from "@/lib/tokens";

export function SellerNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("last-active-chat");
    router.push("/login");
  }

  return (
    <aside
      style={{ width: "220px", flexShrink: 0, borderRight: `1px solid ${c.border}`, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: c.surface, fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${c.border}` }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ backgroundColor: c.primary, width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: "12px" }}>T</span>
          </div>
          <span style={{ color: c.primary, fontWeight: 800, fontSize: "15px", letterSpacing: "-0.3px" }}>TrueWagon</span>
        </Link>
        <p style={{ color: c.muted, fontSize: "11px", marginTop: "4px", marginLeft: "36px" }}>Exporter portal</p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/seller/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "8px", marginBottom: "2px",
                textDecoration: "none", fontSize: "14px", fontWeight: active ? 600 : 500,
                backgroundColor: active ? c.primary : "transparent",
                color: active ? "#fff" : c.muted,
                transition: "all 0.15s",
              }}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: "16px 12px", borderTop: `1px solid ${c.border}` }}>
        <button
          onClick={handleSignOut}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", width: "100%", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "14px", fontWeight: 500, color: c.muted }}
          className="hover:bg-[#F8FAFC] transition-colors"
        >
          <LogOut style={{ width: "16px", height: "16px" }} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
