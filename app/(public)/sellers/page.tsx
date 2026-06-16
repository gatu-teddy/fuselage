import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { c } from "@/lib/tokens";
import { CheckCircle2, MapPin, Car, Search, Star } from "lucide-react";

export const metadata = {
  title: "Verified Exporters · Fuselage",
  description: "Browse verified vehicle exporters on Fuselage. Every seller has passed our manual vetting process.",
};

export default async function ExporterDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string }>;
}) {
  const { q, country } = await searchParams;
  const supabase = createPublicClient();

  let query = supabase
    .from("seller_profiles")
    .select("id, company_name, city, country, description, status, verified_at, plan, created_at, trust_score")
    .eq("status", "verified")
    .order("verified_at", { ascending: false });

  if (country) query = query.eq("country", country);
  if (q)       query = query.ilike("company_name", `%${q}%`);

  const { data: sellers } = await query.limit(60);

  // Countries for filter dropdown
  const { data: countryRows } = await supabase
    .from("seller_profiles")
    .select("country")
    .eq("status", "verified")
    .not("country", "is", null);

  const countries = [...new Set((countryRows ?? []).map((r) => r.country as string))].sort();

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-10">

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: c.primary, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "8px" }}>
            Verified Exporters
          </h1>
          <p style={{ color: c.muted, fontSize: "15px" }}>
            Every exporter on Fuselage has passed our manual vetting process — trade licence verified, identity confirmed.
          </p>
        </div>

        {/* Search + filter bar */}
        <form method="GET" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: c.muted, width: "15px", height: "15px" }} />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search exporters…"
              style={{ width: "100%", height: "42px", paddingLeft: "36px", paddingRight: "12px", border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "14px", color: c.primary, backgroundColor: c.surface, outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <select
            name="country"
            defaultValue={country ?? ""}
            style={{ height: "42px", padding: "0 12px", border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "14px", color: country ? c.primary : c.muted, backgroundColor: c.surface, outline: "none", fontFamily: "Inter, sans-serif", minWidth: "160px" }}
          >
            <option value="">All countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="submit"
            style={{ height: "42px", padding: "0 20px", backgroundColor: c.primary, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
          >
            Search
          </button>
          {(q || country) && (
            <Link
              href="/sellers"
              style={{ height: "42px", padding: "0 16px", backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "14px", color: c.muted, textDecoration: "none", display: "flex", alignItems: "center" }}
            >
              Clear
            </Link>
          )}
        </form>

        {/* Results count */}
        <p style={{ color: c.muted, fontSize: "13px", marginBottom: "16px" }}>
          {sellers?.length ?? 0} verified exporter{sellers?.length !== 1 ? "s" : ""}
          {country ? ` in ${country}` : ""}
          {q ? ` matching "${q}"` : ""}
        </p>

        {/* Grid */}
        {(!sellers || sellers.length === 0) ? (
          <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "60px", textAlign: "center" }}>
            <p style={{ color: c.muted, fontSize: "15px" }}>No exporters found.</p>
            <Link href="/sellers" style={{ color: c.blue, fontSize: "13px", marginTop: "8px", display: "block" }}>Clear filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellers.map((s) => (
              <Link key={s.id} href={`/sellers/${s.id}`} style={{ textDecoration: "none" }} className="group">
                <div
                  style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "22px", height: "100%", boxSizing: "border-box", transition: "box-shadow 0.15s" }}
                  className="hover:shadow-md"
                >
                  {/* Avatar + badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{ backgroundColor: c.primary, width: "48px", height: "48px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#fff", fontWeight: 900, fontSize: "20px" }}>
                        {(s.company_name as string)?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: c.greenBg, color: c.greenText, fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "99px" }}>
                      <CheckCircle2 style={{ width: "9px", height: "9px" }} /> Verified
                    </span>
                  </div>

                  {/* Company name */}
                  <p style={{ color: c.primary, fontSize: "15px", fontWeight: 700, marginBottom: "6px", lineHeight: 1.3 }}>
                    {s.company_name}
                  </p>

                  {/* Location */}
                  {(s.city || s.country) && (
                    <p style={{ color: c.muted, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
                      <MapPin style={{ width: "11px", height: "11px", flexShrink: 0 }} />
                      {[s.city, s.country].filter(Boolean).join(", ")}
                    </p>
                  )}

                  {/* Description */}
                  {s.description && (
                    <p style={{ color: c.body, fontSize: "12px", lineHeight: 1.6, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                      {s.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Car style={{ color: c.muted, width: "11px", height: "11px" }} />
                      <span style={{ color: c.muted, fontSize: "11px" }}>
                        {s.verified_at
                          ? `Verified ${new Date(s.verified_at as string).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`
                          : "Verified exporter"}
                      </span>
                    </div>
                    {(s.trust_score as number) > 0 && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", backgroundColor: c.bgDim, color: c.body, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px", border: `1px solid ${c.border}` }}>
                        <Star style={{ width: "9px", height: "9px", color: c.amber, fill: c.amber }} />
                        {s.trust_score}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
