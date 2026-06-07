"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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
};

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
    if (role === "seller")      router.push("/seller/dashboard");
    else if (role === "admin")  router.push("/admin/applications");
    else                        router.push("/browse");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", height: "44px",
    border: `1px solid ${c.border}`, borderRadius: "8px",
    padding: "0 12px", fontSize: "15px", outline: "none",
    color: c.primary, backgroundColor: c.surface,
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif", minHeight: "100vh" }}
      className="flex items-center justify-center px-4"
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ backgroundColor: c.primary, width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: "15px" }}>F</span>
            </div>
            <span style={{ color: c.primary, fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px" }}>Fuselage</span>
          </Link>
          <p style={{ color: c.muted, fontSize: "14px", marginTop: "8px" }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "32px" }}>

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: c.errorBg, border: `1px solid ${c.error}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ color: c.error, fontSize: "13px" }}>{error}</p>
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
                  placeholder="••••••••"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? c.muted : c.primary,
                color: "#fff", width: "100%", height: "44px",
                borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in…" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p style={{ color: c.muted, fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
            No account?{" "}
            <Link href="/register" style={{ color: c.green, fontWeight: 600, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
