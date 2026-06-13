"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

import { c } from "@/lib/tokens";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaHS6gz6dJxeezM-JE2FjaLCXTZc8RZreIKQCImymQpCf51rhwcOhLgfUrOL8bpo6TU0IFRA-UmJW14RMT7C937Xh7V5kelCiD5Qc8D3n_LhCPHZ0J2GIP2vYVheCW4a3_il8_DbQoSABp21z2KjegIBn9xG42ON_-kdwwyQgWpG3PxN2c3k3mZIiE9l9cdLtFqb6bev6qjKAcGtx3_G2JdPJuN1S_HdKJ5MDe_QpTS3qNPedRgUlKq6O0SMAfOjUI0O8vQTz47s";

const TRUST_POINTS = [
  "200-point inspection on every vehicle",
  "Verified exporters across 6 countries",
  "End-to-end logistics tracking",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    const role = profile?.role;
    if (role === "seller")     router.push("/seller/dashboard");
    else if (role === "admin") router.push("/admin/applications");
    else                       router.push("/browse");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ── Left panel — brand / hero ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "48%", flexShrink: 0, position: "relative",
          backgroundColor: c.primary, flexDirection: "column",
          justifyContent: "flex-end", padding: "48px",
        }}
      >
        {/* Background image */}
        <Image
          src={HERO}
          alt="Premium vehicle"
          fill
          className="object-cover"
          sizes="48vw"
          priority
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.4) 60%, rgba(15,23,42,0.15) 100%)",
          }}
        />

        {/* Content over image */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{ marginBottom: "48px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{ backgroundColor: c.green, width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "14px" }}>F</span>
              </div>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>TrueWagon</span>
            </Link>
          </div>

          <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-0.5px" }}>
            Africa's trusted vehicle import marketplace
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
            Connecting verified exporters with buyers across Africa — every vehicle inspected, every shipment tracked.
          </p>

          {/* Trust points */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {TRUST_POINTS.map((point) => (
              <div key={point} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 style={{ color: c.green, flexShrink: 0, width: "16px", height: "16px" }} />
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form + footer ──────────────────────────────────── */}
      <div
        style={{
          flex: 1, backgroundColor: c.bg,
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Form area */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{ backgroundColor: c.primary, width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "15px" }}>F</span>
              </div>
              <span style={{ color: c.primary, fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px" }}>TrueWagon</span>
            </Link>
          </div>

          <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ color: c.muted, fontSize: "14px", marginBottom: "32px" }}>
            Sign in to continue to your account
          </p>

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: c.errorBg, border: `1px solid ${c.error}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ color: c.error, fontSize: "13px", margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", height: "44px", border: `1px solid ${c.border}`, borderRadius: "8px",
                  padding: "0 12px", fontSize: "15px", outline: "none",
                  color: c.primary, backgroundColor: c.surface, boxSizing: "border-box",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%", height: "44px", border: `1px solid ${c.border}`, borderRadius: "8px",
                    padding: "0 44px 0 12px", fontSize: "15px", outline: "none",
                    color: c.primary, backgroundColor: c.surface, boxSizing: "border-box",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: c.muted }}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? c.muted : c.primary, color: "#fff",
                width: "100%", height: "46px", borderRadius: "8px", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "15px", fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in…" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          {/* Trust badge */}
          <div
            style={{
              marginTop: "28px", padding: "12px 16px",
              backgroundColor: c.surface, border: `1px solid ${c.border}`,
              borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px",
            }}
          >
            <ShieldCheck style={{ color: c.green, flexShrink: 0, width: "18px", height: "18px" }} />
            <p style={{ color: c.muted, fontSize: "12px", margin: 0, lineHeight: 1.4 }}>
              Your account is protected. All data encrypted in transit.
            </p>
          </div>

          <p style={{ color: c.muted, fontSize: "13px", textAlign: "center", marginTop: "24px" }}>
            No account?{" "}
            <Link href="/register" style={{ color: c.green, fontWeight: 600, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>
        </div>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${c.border}`, backgroundColor: c.surface, padding: "18px 32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <div style={{ backgroundColor: c.primary, width: "20px", height: "20px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "10px" }}>F</span>
              </div>
              <span style={{ color: c.primary, fontWeight: 700, fontSize: "13px" }}>TrueWagon</span>
              <span style={{ color: c.muted, fontSize: "13px" }}>© 2026</span>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms",   href: "/terms" },
                { label: "Support", href: "/support" },
                { label: "Browse",  href: "/browse" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{ color: c.muted, fontSize: "13px", textDecoration: "none" }}
                  className="hover:text-[#0F172A] transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <span style={{ color: c.muted, fontSize: "12px" }}>logistics@truewagon.com</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
