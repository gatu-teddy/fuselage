"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Building2, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const c = {
  primary:   "#0F172A",
  green:     "#10B981",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  bg:        "#F8FAFC",
  surface:   "#FFFFFF",
  border:    "#E2E8F0",
  muted:     "#64748B",
  body:      "#334155",
  error:     "#EF4444",
  errorBg:   "#FEF2F2",
  amber:     "#D97706",
  amberBg:   "#FFFBEB",
  amberBorder: "#FDE68A",
};

const inputStyle: React.CSSProperties = {
  width: "100%", height: "44px",
  border: `1px solid ${c.border}`, borderRadius: "8px",
  padding: "0 12px", fontSize: "15px", outline: "none",
  color: c.primary, backgroundColor: c.surface,
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
};

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

  return (
    <div
      style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif", minHeight: "100vh" }}
      className="flex items-center justify-center px-4 py-12"
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ backgroundColor: c.primary, width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: "15px" }}>F</span>
            </div>
            <span style={{ color: c.primary, fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px" }}>Fuselage</span>
          </Link>
          <p style={{ color: c.muted, fontSize: "14px", marginTop: "8px" }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "32px" }}>

          {/* Role picker */}
          <div style={{ marginBottom: "22px" }}>
            <p style={{ color: c.primary, fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>I am a…</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {([
                { value: "buyer",  label: "Buyer",    sub: "Looking to import a vehicle", Icon: User },
                { value: "seller", label: "Exporter", sub: "UAE-based company",            Icon: Building2 },
              ] as const).map(({ value, label, sub, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    border: `2px solid ${role === value ? c.green : c.border}`,
                    borderRadius: "10px", padding: "16px 12px",
                    backgroundColor: role === value ? c.greenBg : c.surface,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <Icon style={{ color: role === value ? c.green : c.muted, width: "20px", height: "20px" }} />
                  <span style={{ color: role === value ? c.greenText : c.primary, fontWeight: 600, fontSize: "14px" }}>{label}</span>
                  <span style={{ color: c.muted, fontSize: "11px", textAlign: "center", lineHeight: "1.3" }}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: c.errorBg, border: `1px solid ${c.error}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "18px" }}>
              <p style={{ color: c.error, fontSize: "13px" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Full name */}
            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Full name
              </label>
              <input
                placeholder="Ahmed Al Rashidi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

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
                style={inputStyle}
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
                  placeholder="Min. 8 characters"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: "44px" }}
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

            {/* Country */}
            <div>
              <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                {role === "buyer" ? "Your country" : "Company country"}
              </label>
              <input
                placeholder={role === "buyer" ? "Nigeria" : "United Arab Emirates"}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Seller notice */}
            {role === "seller" && (
              <div style={{ backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "8px", padding: "10px 14px" }}>
                <p style={{ color: c.amber, fontSize: "12px", lineHeight: "1.5" }}>
                  After registration you will need to submit your UAE trade license for verification before your listings go live.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? c.muted : c.primary,
                color: "#fff", width: "100%", height: "44px",
                borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontSize: "15px", fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Creating account…" : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p style={{ color: c.muted, fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: c.green, fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
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
