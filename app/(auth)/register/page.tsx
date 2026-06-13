"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Building2, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

import { c } from "@/lib/tokens";

// Use the Porsche image for the right panel on register
const SIDE_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuHkVfg0VUaZSNsKiLEIeD8yMNnSVXcjBYGPiPukKpxmqQbVFWB3tN9Qw0FRmp-5djgbBqTie2C91uZ9a01MtI5aeMbn3nhGlZ1SM2Dg33HGEcKR1V2kcVRWnH1lJIzIAjcBbNj_IeYZSf2U_T60hzHfdEERIEKwk0TCdQU8OaBjB842ts4fHX0pGtwFqHUrGHtysQq1SmnUNn_zeRu2-63nx4UsO99BISyyzrOTItMYMALTN0PF90gMUnnX-Cz2Mjmdo7cruBAiY";

const TRUST_POINTS = [
  "2,400+ vehicles exported to Africa",
  "Verified exporters across 6 countries",
  "15+ destination ports covered",
  "24/7 logistics support",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "seller" ? "seller" : "buyer";

  const [role, setRole]         = useState<"buyer" | "seller">(defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [country, setCountry]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role, country } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push(role === "seller" ? "/seller/onboarding" : "/browse");
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%", height: "44px", border: `1px solid ${c.border}`, borderRadius: "8px",
    padding: "0 12px", fontSize: "15px", outline: "none",
    color: c.primary, backgroundColor: c.surface, boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ── Left panel — form + footer ───────────────────────────────────── */}
      <div
        style={{
          flex: 1, backgroundColor: c.bg,
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Form area */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Logo */}
          <div style={{ marginBottom: "28px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{ backgroundColor: c.primary, width: "34px", height: "34px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "14px" }}>F</span>
              </div>
              <span style={{ color: c.primary, fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>TrueWagon</span>
            </Link>
          </div>

          <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>
            Create your account
          </h1>
          <p style={{ color: c.muted, fontSize: "14px", marginBottom: "28px" }}>
            Join Africa's leading vehicle import marketplace
          </p>

          {/* Role picker */}
          <div style={{ marginBottom: "22px" }}>
            <p style={{ color: c.primary, fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>I am a…</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {([
                { value: "buyer",  label: "Buyer",    sub: "Looking to import", Icon: User },
                { value: "seller", label: "Exporter", sub: "Export company",       Icon: Building2 },
              ] as const).map(({ value, label, sub, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    border: `2px solid ${role === value ? c.green : c.border}`,
                    borderRadius: "10px", padding: "14px 10px",
                    backgroundColor: role === value ? c.greenBg : c.surface,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <Icon style={{ color: role === value ? c.green : c.muted, width: "20px", height: "20px" }} />
                  <span style={{ color: role === value ? c.greenText : c.primary, fontWeight: 600, fontSize: "13px" }}>{label}</span>
                  <span style={{ color: c.muted, fontSize: "11px", textAlign: "center" }}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: c.errorBg, border: `1px solid ${c.error}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
              <p style={{ color: c.error, fontSize: "13px", margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "5px" }}>Full name</label>
              <input placeholder="Ahmed Al Rashidi" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={fieldStyle} />
            </div>

            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "5px" }}>Email address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={fieldStyle} />
            </div>

            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "5px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...fieldStyle, paddingRight: "44px" }}
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

            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                {role === "buyer" ? "Your country" : "Company country"}
              </label>
              <input
                placeholder={role === "buyer" ? "Nigeria" : "United Arab Emirates"}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                style={fieldStyle}
              />
            </div>

            {/* Seller notice */}
            {role === "seller" && (
              <div style={{ backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "8px", padding: "10px 14px" }}>
                <p style={{ color: c.amber, fontSize: "12px", lineHeight: 1.5, margin: 0 }}>
                  After registration you will need to submit your trade or business license for verification before your listings go live.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? c.muted : c.primary, color: "#fff",
                width: "100%", height: "46px", borderRadius: "8px", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "15px", fontWeight: 600, marginTop: "4px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Creating account…" : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p style={{ color: c.muted, fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: c.green, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
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
                { label: "Contact", href: "/contact" },
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

      {/* ── Right panel — brand / hero ────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "46%", flexShrink: 0, position: "relative",
          backgroundColor: c.primary, flexDirection: "column",
          justifyContent: "flex-end", padding: "48px",
        }}
      >
        <Image src={SIDE_IMG} alt="Premium vehicle" fill className="object-cover" sizes="46vw" />
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.35) 55%, rgba(15,23,42,0.1) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: c.green, borderRadius: "20px",
              padding: "6px 14px", marginBottom: "24px",
            }}
          >
            <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>TRUSTED PLATFORM</span>
          </div>
          <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, lineHeight: 1.25, marginBottom: "14px", letterSpacing: "-0.5px" }}>
            Every vehicle. Vetted. Shipped. Delivered.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.6, marginBottom: "28px" }}>
            TrueWagon is the only marketplace where every listing passes a 200-point inspection before it ever reaches a buyer.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {TRUST_POINTS.map((point) => (
              <div key={point} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 style={{ color: c.green, flexShrink: 0, width: "15px", height: "15px" }} />
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
