"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Menu, X, Heart, MessageSquare, Headphones,
  LayoutDashboard, ChevronDown, LogOut, User as UserIcon,
} from "lucide-react";

import { c } from "@/lib/tokens";

const publicNavLinks = [
  { label: "Browse",          href: "/browse"        },
  { label: "Vetting Process", href: "/#services"     },
  { label: "How It Works",    href: "/how-it-works"  },
  { label: "Destinations",    href: "/#destinations" },
];

const buyerLinks = [
  { label: "Messages", href: "/buyer/deals",    icon: MessageSquare },
  { label: "Wishlist", href: "/buyer/wishlist", icon: Heart         },
  { label: "Support",  href: "/support",        icon: Headphones    },
];

// ── Avatar initials ────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        backgroundColor: c.primary, color: "#fff",
        fontSize: size * 0.35, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, userSelect: "none",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {initials || <UserIcon style={{ width: size * 0.5, height: size * 0.5 }} />}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AuthNav() {
  const router  = useRouter();
  const dropRef = useRef<HTMLDivElement>(null);

  const [user,        setUser]        = useState<User | null | undefined>(undefined);
  const [role,        setRole]        = useState<string | null>(null);
  const [fullName,    setFullName]    = useState("");
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .single();
        setRole(data?.role ?? null);
        setFullName(data?.full_name ?? user.email ?? "");
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) { setUser(null); setRole(null); setFullName(""); }
      else loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  const loading = user === undefined;

  // ── Profile dropdown ─────────────────────────────────────────────────────
  function ProfileDropdown() {
    return (
      <div ref={dropRef} style={{ position: "relative" }}>
        <button
          onClick={() => setProfileOpen((o) => !o)}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer", padding: "4px",
          }}
        >
          <Avatar name={fullName} size={30} />
          <ChevronDown style={{ color: c.muted, width: "14px", height: "14px" }} />
        </button>

        {profileOpen && (
          <div
            style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              backgroundColor: c.surface, border: `1px solid ${c.border}`,
              borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              minWidth: "200px", zIndex: 60, overflow: "hidden",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {/* User info */}
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${c.border}` }}>
              <p style={{ color: c.primary, fontWeight: 700, fontSize: "13px" }}>{fullName}</p>
              <p style={{ color: c.muted, fontSize: "11px", marginTop: "2px", textTransform: "capitalize" }}>
                {role ?? "member"}
              </p>
            </div>

            {/* Role-based links */}
            {role === "seller" && (
              <Link
                href="/seller/dashboard"
                onClick={() => setProfileOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", textDecoration: "none", borderBottom: `1px solid ${c.border}` }}
                className="hover:bg-[#F8FAFC] transition-colors"
              >
                <LayoutDashboard style={{ color: c.muted, width: "14px", height: "14px" }} />
                <span style={{ color: c.body, fontSize: "13px", fontWeight: 500 }}>Seller Portal</span>
              </Link>
            )}
            {role === "buyer" && buyerLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setProfileOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", textDecoration: "none", borderBottom: `1px solid ${c.border}` }}
                className="hover:bg-[#F8FAFC] transition-colors"
              >
                <Icon style={{ color: c.muted, width: "14px", height: "14px" }} />
                <span style={{ color: c.body, fontSize: "13px", fontWeight: 500 }}>{label}</span>
              </Link>
            ))}

            {/* Sign out */}
            <button
              onClick={signOut}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "11px 16px", width: "100%", background: "none",
                border: "none", cursor: "pointer", textAlign: "left",
              }}
              className="hover:bg-[#FEF2F2] transition-colors"
            >
              <LogOut style={{ color: "#EF4444", width: "14px", height: "14px" }} />
              <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: 500 }}>Sign out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Desktop render ────────────────────────────────────────────────────────
  function DesktopItems() {
    if (loading) return <div style={{ width: "140px" }} />;

    if (!user) {
      return (
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" style={{ color: c.body }}
            className="text-sm font-medium px-4 py-2 hover:opacity-70 transition-opacity">
            Sign In
          </Link>
          <Link href="/register" style={{ backgroundColor: c.primary, color: "#fff" }}
            className="text-sm font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      );
    }

    if (role === "seller") {
      return (
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/seller/dashboard"
            style={{ backgroundColor: c.greenBg, color: c.greenText }}
            className="text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Seller Portal
          </Link>
          <ProfileDropdown />
        </div>
      );
    }

    // Buyer
    return (
      <div className="hidden md:flex items-center gap-1">
        {buyerLinks.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            title={label}
            style={{ color: c.muted }}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <Icon style={{ width: "18px", height: "18px" }} />
          </Link>
        ))}
        <div style={{ width: "1px", height: "24px", backgroundColor: c.border, margin: "0 6px" }} />
        <ProfileDropdown />
      </div>
    );
  }

  // ── Mobile dropdown content ───────────────────────────────────────────────
  function MobileMenuContent() {
    return (
      <nav style={{ padding: "12px 0", fontFamily: "Inter, sans-serif" }}>
        {/* Public nav links */}
        {publicNavLinks.map(({ label, href }) => (
          <Link
            key={label} href={href}
            onClick={() => setMobileOpen(false)}
            style={{ display: "block", padding: "12px 20px", fontSize: "15px", fontWeight: 500, color: c.body, textDecoration: "none" }}
          >
            {label}
          </Link>
        ))}

        <div style={{ borderTop: `1px solid ${c.border}`, margin: "8px 0" }} />

        {!user ? (
          <>
            <Link href="/login" onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "12px 20px", fontSize: "15px", fontWeight: 500, color: c.body, textDecoration: "none" }}>
              Sign In
            </Link>
            <div style={{ padding: "8px 20px 16px" }}>
              <Link href="/register" onClick={() => setMobileOpen(false)}
                style={{ display: "block", textAlign: "center", backgroundColor: c.primary, color: "#fff", padding: "10px 0", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
                Get Started
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Signed-in user info */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px" }}>
              <Avatar name={fullName} size={34} />
              <div>
                <p style={{ color: c.primary, fontWeight: 700, fontSize: "13px" }}>{fullName}</p>
                <p style={{ color: c.muted, fontSize: "11px", textTransform: "capitalize" }}>{role ?? "member"}</p>
              </div>
            </div>

            {role === "seller" && (
              <Link href="/seller/dashboard" onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", fontSize: "14px", fontWeight: 500, color: c.body, textDecoration: "none" }}>
                <LayoutDashboard style={{ width: "16px", height: "16px", color: c.muted }} /> Seller Portal
              </Link>
            )}

            {role === "buyer" && buyerLinks.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", fontSize: "14px", fontWeight: 500, color: c.body, textDecoration: "none" }}>
                <Icon style={{ width: "16px", height: "16px", color: c.muted }} /> {label}
              </Link>
            ))}

            <div style={{ padding: "8px 20px 16px", marginTop: "4px" }}>
              <button onClick={signOut}
                style={{ width: "100%", padding: "10px 0", border: `1px solid #FECACA`, borderRadius: "8px", backgroundColor: "#FEF2F2", color: "#EF4444", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Sign out
              </button>
            </div>
          </>
        )}
      </nav>
    );
  }

  // ── Combined render ───────────────────────────────────────────────────────
  return (
    <>
      {/* Desktop items */}
      <DesktopItems />

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded"
        style={{ color: c.primary }}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen
          ? <X style={{ width: "20px", height: "20px" }} />
          : <Menu style={{ width: "20px", height: "20px" }} />}
      </button>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{ backgroundColor: "transparent" }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="md:hidden absolute top-16 left-0 right-0 z-50"
            style={{ backgroundColor: "#fff", borderBottom: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
            <MobileMenuContent />
          </div>
        </>
      )}
    </>
  );
}
