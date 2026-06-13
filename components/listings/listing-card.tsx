import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, CheckCircle2, ArrowRight, Star, ExternalLink } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { c } from "@/lib/tokens";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ListingCardData {
  id: string;
  year: number;
  make: string;
  model: string;
  price_usd: number;
  mileage?: number | null;
  steering?: string | null;
  availability?: string | null;
  eta_date?: string | null;
  images?: { url: string; is_primary: boolean }[];
  seller?: { company_name: string; city: string; status: string; plan?: string | null; website?: string | null; id?: string } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const availabilityLabel: Record<string, string> = {
  in_stock:  "At Port",
  en_route:  "In Transit",
  pre_order: "Pre-Order",
};

const availabilityColor: Record<string, string> = {
  in_stock:  c.green,
  en_route:  c.amber,
  pre_order: c.muted,
};

/** Placeholder quality score — replace with real scoring once data supports it */
function qualityScore(listing: { price_usd: number; mileage?: number | null }): string {
  const base = 9.0;
  const milePenalty = listing.mileage ? Math.min((listing.mileage / 100_000) * 0.8, 0.8) : 0;
  return (base + Math.random() * 0.9 - milePenalty).toFixed(1);
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ListingCard({ listing }: { listing: ListingCardData }) {
  const primaryImage =
    listing.images?.find((i) => i.is_primary)?.url ??
    listing.images?.[0]?.url ??
    null;

  const seller = listing.seller;
  const isVerified = seller?.status === "verified" || seller?.status === "approved";
  const score = qualityScore(listing);
  const logisticsLabel = (listing.availability && availabilityLabel[listing.availability]) ?? listing.availability ?? "";
  const logisticsColor = (listing.availability && availabilityColor[listing.availability]) ?? c.muted;

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div
        style={{
          backgroundColor: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
        className="hover:shadow-md transition-shadow"
      >
        {/* ── Image ────────────────────────────────────────────────────────── */}
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
            <div
              style={{
                width: "100%", height: "100%",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "6px", color: c.muted,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 500 }}>No photos yet</span>
            </div>
          )}

          {/* Verified badge */}
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

          {/* Logistics status */}
          {logisticsLabel && (
            <div className="absolute top-3 right-3">
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: logisticsColor,
                  border: `1px solid ${logisticsColor}20`,
                }}
                className="text-xs font-semibold px-2 py-1 rounded-full"
              >
                {logisticsLabel}
              </span>
            </div>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="p-4">
          {/* Doc verified + steering chips */}
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
                  color:           listing.steering === "RHD" ? c.blueText  : c.purple,
                  border: `1px solid ${listing.steering === "RHD" ? c.blueBorder : c.purpleBorder}`,
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

          {/* Seller website link — gated by plan */}
          {seller?.id && seller?.website && seller?.plan && seller.plan !== "free" && (
            <a
              href={
                seller.plan === "growth"
                  ? `/api/seller/website-click?sellerId=${seller.id}`
                  : (seller.website.startsWith("http") ? seller.website : `https://${seller.website}`)
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 600,
                color: c.muted,
                textDecoration: "none",
                marginTop: "6px",
                border: `1px solid ${c.border}`,
                borderRadius: "4px",
                padding: "3px 8px",
              }}
              className="hover:border-[#94A3B8] transition-colors"
            >
              <ExternalLink className="h-2.5 w-2.5" />
              Seller website
              {seller.plan === "growth" && (
                <span style={{ backgroundColor: "#EFF6FF", color: "#2563EB", fontSize: "9px", fontWeight: 700, padding: "1px 4px", borderRadius: "3px", marginLeft: "2px" }}>
                  PPC
                </span>
              )}
            </a>
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
}
