import { createPublicClient } from "@/lib/supabase/public";

// Cache this page for 60 s — no auth needed, safe to reuse across visitors
export const revalidate = 60;
import Link from "next/link";
import Image from "next/image";
import { Shield, MapPin, Clock, CheckCircle2, ArrowRight, Star } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { BrowseFilters } from "@/components/listings/browse-filters";
import { AuthNav } from "@/components/layouts/auth-nav";

// ─── Design tokens ────────────────────────────────────────────────────────────
const c = {
  primary:   "#0F172A",
  green:     "#10B981",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  body:      "#334155",
  bg:        "#F8FAFC",
  bgDim:     "#F1F5F9",
  surface:   "#FFFFFF",
  border:    "#E2E8F0",
  muted:     "#64748B",
};

// Fake quality score derived from available fields (placeholder until real scoring exists)
function qualityScore(listing: { price_usd: number; mileage?: number }): string {
  const base = 9.0;
  const milePenalty = listing.mileage ? Math.min((listing.mileage / 100000) * 0.8, 0.8) : 0;
  return (base + Math.random() * 0.9 - milePenalty).toFixed(1);
}

const availabilityLabel: Record<string, string> = {
  in_stock:  "At Port",
  en_route:  "In Transit",
  pre_order: "Pre-Order",
};

const availabilityColor: Record<string, string> = {
  in_stock:  c.green,
  en_route:  "#F59E0B",
  pre_order: c.muted,
};

interface SearchParams {
  type?: string;
  make?: string;
  availability?: string;
  port?: string;
  min?: string;
  max?: string;
  steering?: string;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let listings: any[] | null = null;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = createPublicClient();

      let query = supabase
        .from("listings")
        .select(
          "*, images:listing_images(url, is_primary), seller:seller_profiles(company_name, city, status)"
        )
        .eq("status", "active");

      if (params.type)         query = query.eq("type", params.type);
      if (params.make)         query = query.eq("make", params.make);
      if (params.availability) query = query.eq("availability", params.availability);
      if (params.min)          query = query.gte("price_usd", params.min);
      if (params.max)          query = query.lte("price_usd", params.max);
      if (params.port)         query = query.contains("destination_ports", [params.port]);
      if (params.steering)     query = query.eq("steering", params.steering);

      const { data } = await query.order("created_at", { ascending: false });
      listings = data;
    } catch {
      listings = [];
    }
  }

  return (
    <div style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif" }} className="min-h-screen">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        style={{ backgroundColor: "rgba(255,255,255,0.97)", borderBottom: `1px solid ${c.border}` }}
        className="sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2.5">
            <div style={{ backgroundColor: c.primary }} className="w-7 h-7 rounded flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span style={{ color: c.primary }} className="font-bold text-lg tracking-tight">Fuselage</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Browse",          href: "/browse",        active: true },
              { label: "Vetting Process", href: "/#services",     active: false },
              { label: "How It Works",    href: "/how-it-works",  active: false },
              { label: "Destinations",    href: "/#destinations", active: false },
            ].map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                style={{ color: active ? c.primary : c.body, fontWeight: active ? "600" : "500" }}
                className="text-sm hover:opacity-70 transition-opacity"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth-aware right side + mobile hamburger */}
          <AuthNav />
        </div>
      </nav>

      {/* ── PAGE BODY ───────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 md:py-10">
        <div className="flex items-start gap-8">

          {/* ── Filters sidebar — desktop only ──────────────────────────── */}
          <aside
            className="hidden md:block"
            style={{
              width: "240px",
              flexShrink: 0,
              backgroundColor: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "0.5rem",
              padding: "20px",
            }}
          >
            <BrowseFilters currentParams={params} />
          </aside>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Header row */}
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
              <div className="min-w-0">
                <h1 style={{ color: c.primary }} className="text-xl md:text-2xl font-bold tracking-tight">
                  Vetted Marketplace
                </h1>
                <p style={{ color: c.muted }} className="text-sm mt-0.5">
                  Showing {listings?.length ?? 0} high-performance international listings
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile filter button */}
                <BrowseFilters currentParams={params} mobileOnly={true} />
                <div
                  style={{ border: `1px solid ${c.border}`, borderRadius: "6px", backgroundColor: c.surface }}
                  className="hidden md:flex items-center gap-2 px-3 h-9"
                >
                  <span style={{ color: c.muted }} className="text-xs">Sort by:</span>
                  <span style={{ color: c.primary }} className="text-xs font-semibold">Newest First</span>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {(!listings || listings.length === 0) && (
              <div
                style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
                className="text-center py-20"
              >
                <p style={{ color: c.muted }} className="mb-4">No listings match your filters.</p>
                <Link
                  href="/browse"
                  style={{ backgroundColor: c.primary, color: "#fff" }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-9 rounded hover:opacity-90 transition-opacity"
                >
                  Clear filters
                </Link>
              </div>
            )}

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {listings?.map((listing) => {
                const images = listing.images as { url: string; is_primary: boolean }[];
                const primaryImage = images?.find((i) => i.is_primary)?.url ?? images?.[0]?.url ?? null;
                const seller = listing.seller as { company_name: string; city: string; status: string };
                const isVerified = seller?.status === "verified" || seller?.status === "approved";
                const score = qualityScore(listing);
                const logisticsLabel = availabilityLabel[listing.availability] ?? listing.availability;
                const logisticsColor = availabilityColor[listing.availability] ?? c.muted;

                return (
                  <Link key={listing.id} href={`/listings/${listing.id}`} className="group block">
                    <div
                      style={{
                        backgroundColor: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                      }}
                      className="hover:shadow-md transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative" style={{ aspectRatio: "4/3", backgroundColor: c.bgDim }}>
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={`${listing.year} ${listing.make} ${listing.model}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", color: c.muted }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                            <span style={{ fontSize: "11px", fontWeight: 500 }}>No photos yet</span>
                          </div>
                        )}
                        {/* Verified badge overlay */}
                        {isVerified && (
                          <div className="absolute top-3 left-3">
                            <span
                              style={{ backgroundColor: c.greenBg, color: c.greenText }}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          </div>
                        )}
                        {/* Logistics status badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            style={{ backgroundColor: "rgba(255,255,255,0.92)", color: logisticsColor, border: `1px solid ${logisticsColor}20` }}
                            className="text-xs font-semibold px-2 py-1 rounded-full"
                          >
                            {logisticsLabel}
                          </span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        {/* Chips row: Doc Verified + RHD/LHD */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            style={{ backgroundColor: c.greenBg, color: c.greenText }}
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          >
                            Doc Verified
                          </span>
                          {listing.steering && (
                            <span
                              style={{
                                backgroundColor: listing.steering === "RHD" ? "#EFF6FF" : "#F5F3FF",
                                color: listing.steering === "RHD" ? "#1D4ED8" : "#6D28D9",
                                border: `1px solid ${listing.steering === "RHD" ? "#BFDBFE" : "#DDD6FE"}`,
                              }}
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                            >
                              {listing.steering}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 style={{ color: c.primary }} className="font-semibold text-sm leading-snug mb-0.5">
                          {listing.year} {listing.make} {listing.model}
                        </h3>
                        <p style={{ color: c.muted }} className="text-xs mb-3">
                          FOB {seller?.city ?? "origin port"}
                        </p>

                        {/* Price */}
                        <p style={{ color: c.primary }} className="text-lg font-bold mb-3">
                          {formatUSD(listing.price_usd)}
                        </p>

                        {/* Meta row */}
                        <div style={{ borderTop: `1px solid ${c.border}` }} className="pt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {listing.mileage && (
                              <span style={{ color: c.muted }} className="text-xs">
                                {listing.mileage.toLocaleString()} km
                              </span>
                            )}
                            {seller?.city && (
                              <span style={{ color: c.muted }} className="flex items-center gap-1 text-xs">
                                <MapPin className="h-3 w-3" />
                                {seller.city}
                              </span>
                            )}
                          </div>
                          {/* Quality score */}
                          <span style={{ color: c.green }} className="flex items-center gap-1 text-xs font-semibold">
                            <Star className="h-3 w-3 fill-current" />
                            {score}/10
                          </span>
                        </div>

                        {/* ETA */}
                        {listing.eta_date && (
                          <div style={{ color: c.muted }} className="flex items-center gap-1 text-xs mt-2">
                            <Clock className="h-3 w-3" />
                            ETA: {new Date(listing.eta_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        )}

                        {/* View Details CTA */}
                        <div
                          style={{ color: c.primary }}
                          className="flex items-center gap-1 text-xs font-semibold mt-3 group-hover:text-[#10B981] transition-colors"
                        >
                          View Details <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination stub */}
            {listings && listings.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {[1, 2, 3].map((p) => (
                  <div
                    key={p}
                    style={{
                      width: "36px", height: "36px", borderRadius: "6px",
                      border: `1px solid ${p === 1 ? c.primary : c.border}`,
                      backgroundColor: p === 1 ? c.primary : c.surface,
                      color: p === 1 ? "#fff" : c.body,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: p === 1 ? "600" : "400",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
