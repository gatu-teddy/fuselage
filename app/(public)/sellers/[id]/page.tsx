import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/public";
import { c } from "@/lib/tokens";
import { formatUSD } from "@/lib/utils";
import { CheckCircle2, MapPin, Globe, Calendar, Bike, ShieldCheck, Clock } from "lucide-react";

function TrustScore({ score }: { score: number }) {
  const colour = score >= 80 ? c.green : score >= 50 ? c.amber : c.red;
  const label  = score >= 80 ? "High trust" : score >= 50 ? "Building trust" : "New";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ position: "relative", width: "48px", height: "48px" }}>
        <svg viewBox="0 0 48 48" style={{ width: "48px", height: "48px", transform: "rotate(-90deg)" }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke={c.border} strokeWidth="4" />
          <circle cx="24" cy="24" r="20" fill="none" stroke={colour} strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - score / 100)}`}
            strokeLinecap="round" />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: colour }}>
          {score}
        </span>
      </div>
      <div>
        <p style={{ color: colour, fontSize: "13px", fontWeight: 700 }}>{label}</p>
        <p style={{ color: c.muted, fontSize: "11px" }}>Trust score / 100</p>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = {
    verified:  { bg: "#D1FAE5", text: "#065F46", icon: <CheckCircle2 className="h-3 w-3" />, label: "Verified Exporter" },
    pending:   { bg: "#FEF3C7", text: "#92400E", icon: <Clock className="h-3 w-3" />,        label: "Verification Pending" },
    rejected:  { bg: "#FEE2E2", text: "#991B1B", icon: null,                                  label: "Not Verified" },
    suspended: { bg: "#FEE2E2", text: "#991B1B", icon: null,                                  label: "Suspended" },
  }[status] ?? { bg: "#F1F5F9", text: "#64748B", icon: null, label: status };

  return (
    <span
      style={{ backgroundColor: cfg.bg, color: cfg.text, fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "99px", display: "inline-flex", alignItems: "center", gap: "5px" }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createPublicClient();

  // Fetch seller profile (no private fields)
  const { data: seller } = await supabase
    .from("seller_profiles")
    .select("id, company_name, city, country, description, status, verified_at, website, created_at, plan, trust_score")
    .eq("id", id)
    .single();

  if (!seller) notFound();

  // Active listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, year, make, model, price_usd, mileage_km, steering, images:listing_images(url, is_primary)")
    .eq("seller_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);

  // Deal stats — completed deals count only (no private data)
  const { count: completedDeals } = await supabase
    .from("deals")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", id)
    .eq("status", "completed");

  const { count: activeListingCount } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", id)
    .eq("status", "active");

  const memberSince = seller.created_at
    ? new Date(seller.created_at).getFullYear()
    : null;

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-10">

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <Link href="/browse" style={{ color: c.muted, fontSize: "13px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          ← Back to Browse
        </Link>

        {/* ── Profile header ─────────────────────────────────────────────── */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "28px", marginBottom: "24px" }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Avatar */}
            <div style={{ backgroundColor: c.primary, width: "72px", height: "72px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: "28px" }}>
                {seller.company_name?.[0]?.toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" }}>
                  {seller.company_name}
                </h1>
                <StatusBadge status={seller.status} />
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                {(seller.city || seller.country) && (
                  <span style={{ color: c.muted, fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <MapPin className="h-3.5 w-3.5" />
                    {[seller.city, seller.country].filter(Boolean).join(", ")}
                  </span>
                )}
                {memberSince && (
                  <span style={{ color: c.muted, fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <Calendar className="h-3.5 w-3.5" />
                    Member since {memberSince}
                  </span>
                )}
                {seller.website && (
                  seller.plan === "free" || !seller.plan ? (
                    <span
                      title="This exporter hasn't enabled external website links"
                      style={{ color: c.muted, fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", opacity: 0.4, cursor: "not-allowed", userSelect: "none" }}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Website
                    </span>
                  ) : (
                    <a
                      href={`/api/seller/website-click?sellerId=${seller.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: c.blue, fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Website
                    </a>
                  )
                )}
              </div>

              {seller.description && (
                <p style={{ color: c.body, fontSize: "14px", lineHeight: 1.7, maxWidth: "600px" }}>
                  {seller.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Bike className="h-5 w-5" />,         label: "Active listings", value: activeListingCount ?? 0 },
            { icon: <CheckCircle2 className="h-5 w-5" />, label: "Completed deals", value: completedDeals ?? 0 },
            { icon: <ShieldCheck className="h-5 w-5" />,  label: "Verification",    value: seller.status === "verified" ? "Verified" : "Pending" },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "18px 20px", textAlign: "center" }}>
              <div style={{ color: c.green, display: "flex", justifyContent: "center", marginBottom: "8px" }}>{icon}</div>
              <p style={{ color: c.primary, fontSize: "22px", fontWeight: 800 }}>{value}</p>
              <p style={{ color: c.muted, fontSize: "12px", marginTop: "2px" }}>{label}</p>
            </div>
          ))}
          <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrustScore score={seller.trust_score as number ?? 0} />
          </div>
        </div>

        {/* ── Active listings ─────────────────────────────────────────────── */}
        <h2 style={{ color: c.primary, fontSize: "16px", fontWeight: 700, marginBottom: "14px" }}>
          Current listings
        </h2>

        {(!listings || listings.length === 0) ? (
          <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "40px", textAlign: "center" }}>
            <p style={{ color: c.muted, fontSize: "14px" }}>No active listings at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((l) => {
              const imgs = l.images as { url: string; is_primary: boolean }[] | null;
              const img = imgs?.find((i) => i.is_primary)?.url ?? imgs?.[0]?.url ?? null;
              return (
                <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none" }} className="group">
                  <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }} className="hover:shadow-md transition-shadow">
                    <div style={{ position: "relative", aspectRatio: "16/10", backgroundColor: c.bgDim }}>
                      {img ? (
                        <Image src={img} alt={`${l.year} ${l.make}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 100vw, 33vw" className="group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: c.muted }}>
                          <Bike className="h-8 w-8 opacity-30" />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "14px" }}>
                      <p style={{ color: c.primary, fontWeight: 700, fontSize: "14px" }}>{l.year} {l.make} {l.model}</p>
                      <p style={{ color: c.green, fontWeight: 700, fontSize: "15px", marginTop: "4px" }}>{formatUSD(l.price_usd)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {l.mileage_km && <span style={{ color: c.muted, fontSize: "12px" }}>{(l.mileage_km as number).toLocaleString()} km</span>}
                        {l.steering && (
                          <span style={{ backgroundColor: l.steering === "RHD" ? "#EFF6FF" : "#F5F3FF", color: l.steering === "RHD" ? "#2563EB" : "#7C3AED", fontSize: "11px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px" }}>
                            {l.steering}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Trust notice ────────────────────────────────────────────────── */}
        {seller.status === "verified" && (
          <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", padding: "16px 20px", marginTop: "24px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: c.green }} />
            <div>
              <p style={{ color: "#15803D", fontSize: "13px", fontWeight: 700 }}>Verified exporter</p>
              <p style={{ color: "#166534", fontSize: "12px", lineHeight: 1.6, marginTop: "2px" }}>
                This exporter has passed TrueWagon&apos;s manual review. Their trade licence and business registration have been verified by our compliance team.
                {seller.verified_at && ` Verified ${new Date(seller.verified_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}.`}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
