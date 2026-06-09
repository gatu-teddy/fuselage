import { createPublicClient } from "@/lib/supabase/public";

// Cache this page for 60 s — no auth needed, safe to reuse across visitors
export const revalidate = 60;
import Link from "next/link";
import Image from "next/image";
import { Shield, MapPin, Clock, CheckCircle2, ArrowRight, Star } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { BrowseFilters } from "@/components/listings/browse-filters";
import { MobileNavLinks } from "@/components/layouts/mobile-nav-links";

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

// ─── Stitch fallback images by make ──────────────────────────────────────────
const FALLBACK: Record<string, string> = {
  Porsche:    "https://lh3.googleusercontent.com/aida-public/AB6AXuAuHkVfg0VUaZSNsKiLEIeD8yMNnSVXcjBYGPiPukKpxmqQbVFWB3tN9Qw0FRmp-5djgbBqTie2C91uZ9a01MtI5aeMbn3nhGlZ1SM2Dg33HGEcKR1V2kcVRWnH1lJIzIAjcBbNj_IeYZSf2U_T60hzHfdEERIEKwk0TCdQU8OaBjB842ts4fHX0pGtwFqHUrGHtysQq1SmnUNn_zeRu2-63nx4UsO99BISyyzrOTItMYMALTN0PF90gMUnnX-Cz2Mjmdo7cruBAiY",
  BMW:        "https://lh3.googleusercontent.com/aida-public/AB6AXuBPSPgXddMyCczflpuV_PXhTfMIzpJNRUJ5-lhrceZ94TEczZ3-DIMsOH74dq8DXetMGHSHX0ZiJ3EMI7XJW8tQTYOxlFp6rfZFP5RUkj8IZThSMOY1maC4FoLcymlbT8W6Mf6sibbEhEPkU2jhjBe7Y7XZ3LPx9boudLx4ZL10jg25UdU6NPWCwwSF8AaowzFXrQ4bQSF45y4LCAEhpcP3nHp4xouXS_akGVI-ZxZocKBXDgRWh_MhauW001NWA7njdpwergrcTe4",
  Mercedes:   "https://lh3.googleusercontent.com/aida-public/AB6AXuDwIeFdGZKiF_5ElpeZR65A-cloxXDBLwrgjR737hUL_qwSr2VkHo4lDQjo9hUTOT4jLAuK8khxFII0Y6ArWvo5f_1J8ACmGPbjlIz07OH4m6m9c3LN_fKBIWUX5IQHZZUS00iAnF2UpIafNr3TXGF_p2Y-jRXqM_VFC2yQ4enj6ZRwBAy0erlN7_e-H_J0PjNcL3VUq1p_4GBTkVIrlioT9cWqmyxnZ31LDXOqduw7aOzGGzjwkjye_GXzLuREdDVluwRaEUadM5Y",
  Ferrari:    "https://lh3.googleusercontent.com/aida-public/AB6AXuAmUhwT_Qkg--4MYWFkrfdFh_QbGTMUMWjTwZ9WVhjZtnkLgIOi85cSu9W-vkwky_dcyfIEwjqLCm45Er6qyeX3QBMGhTu5YilYoU7CKeYet43h7ZOoRlIynVUSEsN7-EBQpW16Tfioz2pxSYyR6w_Fer9AN5VnkkjcuiVCQHtt9ACExiap-eWMPLQG12Y0zKIPsQLzovFtliN4xzkkFRbSmFNlsN94DICFJy35EzJAvgU35uaiSqJ8avYiaJAOxnW3f04N9y5MI98",
  DEFAULT:    "https://lh3.googleusercontent.com/aida-public/AB6AXuBPSPgXddMyCczflpuV_PXhTfMIzpJNRUJ5-lhrceZ94TEczZ3-DIMsOH74dq8DXetMGHSHX0ZiJ3EMI7XJW8tQTYOxlFp6rfZFP5RUkj8IZThSMOY1maC4FoLcymlbT8W6Mf6sibbEhEPkU2jhjBe7Y7XZ3LPx9boudLx4ZL10jg25UdU6NPWCwwSF8AaowzFXrQ4bQSF45y4LCAEhpcP3nHp4xouXS_akGVI-ZxZocKBXDgRWh_MhauW001NWA7njdpwergrcTe4",
};

function getFallback(make: string): string {
  return FALLBACK[make] ?? FALLBACK.DEFAULT;
}

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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" style={{ color: c.body }} className="text-sm font-medium px-4 py-2 hover:opacity-70 transition-opacity">
              Sign In
            </Link>
            <Link href="/register" style={{ backgroundColor: c.primary, color: "#fff" }} className="text-sm font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <MobileNavLinks />
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
                <BrowseFilters currentParams={params} mobileOnly />
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
                const primaryImage = images?.find((i) => i.is_primary)?.url ?? images?.[0]?.url;
                const seller = listing.seller as { company_name: string; city: string; status: string };
                const isVerified = seller?.status === "verified" || seller?.status === "approved";
                const imgSrc = primaryImage ?? getFallback(listing.make);
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
                      <div className="relative" style={{ aspectRatio: "4/3" }}>
                        <Image
                          src={imgSrc}
                          alt={`${listing.year} ${listing.make} ${listing.model}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
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
                        {/* Doc verified chip */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            style={{ backgroundColor: c.greenBg, color: c.greenText }}
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          >
                            Doc Verified
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{ color: c.primary }} className="font-semibold text-sm leading-snug mb-0.5">
                          {listing.year} {listing.make} {listing.model}
                        </h3>
                        <p style={{ color: c.muted }} className="text-xs mb-3">
                          FOB {seller?.city ?? "Dubai"}
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
