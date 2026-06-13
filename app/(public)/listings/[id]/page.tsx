import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { InquiryForm } from "@/components/listings/inquiry-form";
import {
  Shield, MapPin, Calendar, Hash, Gauge, Clock,
  CheckCircle2, ChevronRight, Car, ArrowRight,
} from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";

import { c } from "@/lib/tokens";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Public client for listing data (no auth needed)
  const supabase = createPublicClient();
  const authClient = await createClient();

  const [{ data: listing }, { data: { user } }] = await Promise.all([
    supabase
      .from("listings")
      .select("*, images:listing_images(*), seller:seller_profiles(company_name, city, country, description, status, website)")
      .eq("id", id)
      .eq("status", "active")
      .single(),
    authClient.auth.getUser(),
  ]);

  if (!listing) notFound();

  // Is the viewer the seller who owns this listing?
  const isSeller = !!user && user.id === listing.seller_id;

  // Check if this buyer has already inquired → reveal full VIN
  let vinRevealed = false;
  if (user && !isSeller) {
    const { data: deal } = await authClient
      .from("deals")
      .select("id")
      .eq("listing_id", id)
      .eq("buyer_id", user.id)
      .neq("status", "cancelled")
      .maybeSingle();
    vinRevealed = !!deal;
  }
  if (isSeller) vinRevealed = true; // seller always sees full VIN on their own listing

  // Tiered similar listings — shown to sellers instead of inquiry form
  type SimilarListing = {
    id: string; year: number; make: string; model: string;
    price_usd: number; mileage_km: number | null; steering: string | null;
    images: { url: string; is_primary: boolean }[];
    seller: { city: string };
  };
  const SIMILAR_SELECT = "id, year, make, model, price_usd, mileage_km, steering, images:listing_images(url, is_primary), seller:seller_profiles(city)";
  let similarListings: SimilarListing[] = [];
  let similarMakeMatch = false; // used for "See all →" link

  if (isSeller) {
    // ── Tier 1+2: same make (up to 10), then sort so same model floats first ──
    const { data: sameMakeRows } = await supabase
      .from("listings")
      .select(SIMILAR_SELECT)
      .eq("status", "active")
      .eq("make", listing.make)
      .neq("id", id)
      .limit(10);

    if (sameMakeRows && sameMakeRows.length > 0) {
      similarMakeMatch = true;
      // Sort: exact model match first, then others
      const sorted = [...sameMakeRows].sort((a, b) => {
        const am = (a.model as string).toLowerCase() === (listing.model as string).toLowerCase() ? 0 : 1;
        const bm = (b.model as string).toLowerCase() === (listing.model as string).toLowerCase() ? 0 : 1;
        return am - bm;
      });
      similarListings = sorted.slice(0, 6) as unknown as SimilarListing[];
    }

    // ── Tier 3: any other active listing (guaranteed minimum 1) ─────────────
    if (similarListings.length === 0) {
      const { data: anyRows } = await supabase
        .from("listings")
        .select(SIMILAR_SELECT)
        .eq("status", "active")
        .neq("id", id)
        .limit(6);
      similarListings = (anyRows ?? []) as unknown as SimilarListing[];
    }
  }

  // "See all" URL — pre-fills browse filters with make when we have make-matched results
  const seeAllHref = similarMakeMatch
    ? `/browse?make=${encodeURIComponent(listing.make as string)}`
    : `/browse`;

  // VIN masking helper
  function maskVin(vin: string): string {
    if (vin.length <= 8) return vin.slice(0, 2) + "•".repeat(vin.length - 2);
    return vin.slice(0, 6) + "•".repeat(vin.length - 10) + vin.slice(-4);
  }

  const images = (listing.images as { id: string; url: string; is_primary: boolean; position: number }[])
    ?.sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return a.position - b.position;
    });

  const seller = listing.seller as {
    company_name: string; city: string; country?: string; description: string;
    status: string; website?: string;
  };

  const availLabel: Record<string, string> = {
    in_stock:  "In stock — ready to ship",
    en_route:  "En route",
    pre_order: "Pre-order",
  };
  const availColor: Record<string, string> = {
    in_stock:  c.green,
    en_route:  c.amber,
    pre_order: c.muted,
  };
  const availBg: Record<string, string> = {
    in_stock:  c.greenBg,
    en_route:  c.amberBg,
    pre_order: "#F1F5F9",
  };

  return (
    <>

      <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/browse" style={{ color: c.muted, textDecoration: "none" }} className="hover:text-[#0F172A] transition-colors">
            Browse
          </Link>
          <ChevronRight style={{ color: c.muted, width: "14px", height: "14px" }} />
          <span style={{ color: c.primary, fontWeight: 500 }}>{listing.year} {listing.make} {listing.model}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: images + specs ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main image */}
            <div style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: c.bgDim }}>
              <div style={{ position: "relative", aspectRatio: "16/9" }}>
                {images?.[0] ? (
                  <Image
                    src={images[0].url}
                    alt={`${listing.year} ${listing.make} ${listing.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: c.muted }}>
                    No photos available
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images && images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.slice(1).map((img) => (
                  <div
                    key={img.id}
                    style={{ width: "80px", height: "60px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: `2px solid ${c.border}` }}
                  >
                    <Image src={img.url} alt="" width={80} height={60} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Title & price */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 style={{ color: c.primary, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                  {listing.year} {listing.make} {listing.model}
                </h1>
                {listing.color && <p style={{ color: c.muted, fontSize: "14px", marginTop: "4px" }}>{listing.color}</p>}
                <p style={{ color: c.primary, fontSize: "28px", fontWeight: 800, marginTop: "12px" }}>
                  {formatUSD(listing.price_usd)}
                  <span style={{ color: c.muted, fontSize: "14px", fontWeight: 400, marginLeft: "8px" }}>FOB {seller?.city ?? "origin port"}</span>
                </p>
              </div>
              <span
                style={{
                  backgroundColor: availBg[listing.availability] ?? c.bgDim,
                  color: availColor[listing.availability] ?? c.muted,
                  fontSize: "12px", fontWeight: 700, padding: "6px 14px",
                  borderRadius: "20px", whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                {availLabel[listing.availability] ?? listing.availability}
              </span>
            </div>

            {/* Specs */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "24px" }}>
              <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
                Specifications
              </p>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { icon: Calendar, label: "Year",    value: listing.year?.toString() ?? "—" },
                  { icon: Gauge,    label: "Mileage", value: listing.mileage_km != null ? `${Number(listing.mileage_km).toLocaleString()} km` : "—" },
                  { icon: Hash,     label: "Engine",  value: listing.engine_size ?? "—" },
                  { icon: Car,      label: "Steering",value: listing.steering ?? "—" },
                  { icon: MapPin,   label: "Origin",  value: seller?.city ? `${seller.city}${seller.country ? `, ${seller.country}` : ""}` : "—" },
                  { icon: Clock,    label: "ETA",     value: listing.eta_date ? formatDate(listing.eta_date) : "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon style={{ color: c.muted, flexShrink: 0, width: "15px", height: "15px", marginTop: "2px" }} />
                    <div>
                      <dt style={{ color: c.muted, fontSize: "11px", fontWeight: 600 }}>{label}</dt>
                      <dd style={{ color: c.primary, fontSize: "13px", fontWeight: 600, marginTop: "2px", fontVariantNumeric: "tabular-nums" }}>{value}</dd>
                    </div>
                  </div>
                ))}

                {/* Chassis / VIN — masked until inquiry */}
                {listing.chassis_number && (
                  <div className="flex items-start gap-3 col-span-2">
                    <Hash style={{ color: c.muted, flexShrink: 0, width: "15px", height: "15px", marginTop: "2px" }} />
                    <div>
                      <dt style={{ color: c.muted, fontSize: "11px", fontWeight: 600 }}>Chassis / VIN</dt>
                      {vinRevealed ? (
                        <dd style={{ color: c.primary, fontSize: "13px", fontWeight: 600, marginTop: "2px", fontFamily: "monospace" }}>
                          {listing.chassis_number}
                        </dd>
                      ) : (
                        <dd style={{ marginTop: "2px" }}>
                          <span style={{ color: c.primary, fontSize: "13px", fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                            {maskVin(listing.chassis_number as string)}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginLeft: "8px", backgroundColor: c.amberBg, color: "#92400E", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                            🔒 Revealed after inquiry
                          </span>
                        </dd>
                      )}
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {/* Features */}
            {listing.features?.length > 0 && (
              <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "24px" }}>
                <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {(listing.features as string[]).map((f) => (
                    <span
                      key={f}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: c.greenBg, color: c.greenText, fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "20px" }}
                    >
                      <CheckCircle2 style={{ width: "11px", height: "11px" }} />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "24px" }}>
                <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Description
                </p>
                <p style={{ color: c.body, fontSize: "14px", lineHeight: 1.7 }}>{listing.description}</p>
              </div>
            )}

            {/* Ships to */}
            {listing.destination_ports?.length > 0 && (
              <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "24px" }}>
                <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Ships to
                </p>
                <div className="flex flex-wrap gap-2">
                  {(listing.destination_ports as string[]).map((port) => (
                    <span
                      key={port}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: `1px solid ${c.border}`, color: c.body, fontSize: "13px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px" }}
                    >
                      <MapPin style={{ width: "11px", height: "11px", color: c.green }} />
                      {port}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: exporter + inquiry ─────────────────────────────────── */}
          <div className="space-y-4">

            {/* Exporter card */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}>
              <div className="flex items-start gap-3 mb-4">
                <div style={{ backgroundColor: c.primary, width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>
                    {seller?.company_name?.[0]}
                  </span>
                </div>
                <div>
                  <p style={{ color: c.primary, fontWeight: 700, fontSize: "14px" }}>{seller?.company_name}</p>
                  <p style={{ color: c.muted, fontSize: "12px" }}>{seller?.city}{seller?.country ? `, ${seller.country}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Shield style={{ color: c.green, width: "14px", height: "14px" }} />
                <span style={{ color: c.greenText, fontWeight: 600, fontSize: "12px" }}>Verified exporter</span>
              </div>
              {seller?.description && (
                <p style={{ color: c.muted, fontSize: "12px", lineHeight: 1.6 }} className="line-clamp-3">
                  {seller.description}
                </p>
              )}
            </div>

            {/* Inquiry — hidden for the seller who owns this listing */}
            {isSeller ? (
              <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}>
                {/* Header */}
                <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
                  {similarMakeMatch ? `Other ${listing.make as string} listings` : "Other listings"}
                </p>

                {similarListings.length === 0 ? (
                  /* ── Zero results: no other listings exist in DB at all ── */
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔍</div>
                    <p style={{ color: c.primary, fontWeight: 600, fontSize: "13px", marginBottom: "4px" }}>No similar listings yet</p>
                    <p style={{ color: c.muted, fontSize: "12px", lineHeight: 1.5, marginBottom: "16px" }}>
                      You&apos;re the first to list a {listing.make as string} on TrueWagon.
                    </p>
                    <Link
                      href="/browse"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: c.primary, color: "#fff", fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "6px", textDecoration: "none" }}
                    >
                      Browse all listings <ArrowRight style={{ width: "12px", height: "12px" }} />
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* ── Scrollable list — max 6 ── */}
                    <div style={{ maxHeight: "420px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
                      {similarListings.map((s) => {
                        const simImages = s.images as { url: string; is_primary: boolean }[];
                        const simThumb = simImages?.find((i) => i.is_primary)?.url ?? simImages?.[0]?.url ?? null;
                        const simSeller = s.seller as { city: string };
                        const sameModel = (s.model as string).toLowerCase() === (listing.model as string).toLowerCase();

                        return (
                          <Link
                            key={s.id}
                            href={`/listings/${s.id}`}
                            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", padding: "8px 6px", borderRadius: "8px" }}
                            className="group hover:bg-[#F8FAFC] transition-colors"
                          >
                            {/* Thumbnail */}
                            <div style={{ width: "64px", height: "48px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, backgroundColor: c.bgDim, border: `1px solid ${c.border}` }}>
                              {simThumb ? (
                                <Image src={simThumb} alt="" width={64} height={48} className="object-cover w-full h-full" />
                              ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: c.muted }}>
                                  <Car style={{ width: "18px", height: "18px" }} />
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <p style={{ color: c.primary, fontSize: "12px", fontWeight: 600 }} className="truncate group-hover:text-[#10B981] transition-colors">
                                  {s.year} {s.make} {s.model}
                                </p>
                                {sameModel && (
                                  <span style={{ backgroundColor: c.greenBg, color: c.greenText, fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", flexShrink: 0 }}>
                                    SAME
                                  </span>
                                )}
                              </div>
                              <p style={{ color: c.primary, fontSize: "12px", fontWeight: 700, marginTop: "1px" }}>
                                {formatUSD(s.price_usd)}
                              </p>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                                {s.mileage_km != null && (
                                  <span style={{ color: c.muted, fontSize: "10px" }}>
                                    {Number(s.mileage_km).toLocaleString()} km
                                  </span>
                                )}
                                {s.steering && (
                                  <span style={{ color: s.steering === "RHD" ? "#1D4ED8" : "#6D28D9", backgroundColor: s.steering === "RHD" ? "#EFF6FF" : "#F5F3FF", fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px" }}>
                                    {s.steering}
                                  </span>
                                )}
                                {simSeller?.city && (
                                  <span style={{ color: c.muted, fontSize: "10px" }}>· {simSeller.city}</span>
                                )}
                              </div>
                            </div>

                            <ArrowRight style={{ color: c.muted, width: "12px", height: "12px", flexShrink: 0 }} />
                          </Link>
                        );
                      })}
                    </div>

                    {/* ── See all → ── */}
                    <Link
                      href={seeAllHref}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "14px", color: c.primary, fontSize: "12px", fontWeight: 600, textDecoration: "none", border: `1px solid ${c.border}`, borderRadius: "6px", padding: "9px 0" }}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      {similarMakeMatch ? `See all ${listing.make as string} listings` : "See all listings"}
                      <ArrowRight style={{ width: "12px", height: "12px" }} />
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <InquiryForm
                listingId={listing.id}
                sellerId={listing.seller_id}
                listingTitle={`${listing.year} ${listing.make} ${listing.model}`}
                currentUser={user}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
