import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { InquiryForm } from "@/components/listings/inquiry-form";
import {
  Shield, MapPin, Calendar, Hash, Gauge, Clock,
  CheckCircle2, ChevronRight, Car,
} from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";

// ─── Design tokens ────────────────────────────────────────────────────────────
const c = {
  primary:   "#0F172A",
  green:     "#10B981",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  bg:        "#F8FAFC",
  bgDim:     "#F1F5F9",
  surface:   "#FFFFFF",
  border:    "#E2E8F0",
  muted:     "#64748B",
  body:      "#334155",
  amber:     "#F59E0B",
  amberBg:   "#FEF3C7",
};

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Public client for listing data (no auth needed)
  const supabase = createPublicClient();
  const authClient = await createClient();

  const [{ data: listing }, { data: { user } }] = await Promise.all([
    supabase
      .from("listings")
      .select("*, images:listing_images(*), seller:seller_profiles(*, profile:profiles(full_name, email))")
      .eq("id", id)
      .eq("status", "active")
      .single(),
    authClient.auth.getUser(),
  ]);

  if (!listing) notFound();

  const images = (listing.images as { id: string; url: string; is_primary: boolean; position: number }[])
    ?.sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return a.position - b.position;
    });

  const seller = listing.seller as {
    company_name: string; city: string; description: string;
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
    <div style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ backgroundColor: c.primary, width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: "12px" }}>F</span>
            </div>
            <span style={{ color: c.primary, fontWeight: 800, fontSize: "16px", letterSpacing: "-0.5px" }}>Fuselage</span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Browse",       href: "/browse" },
              { label: "How It Works", href: "/how-it-works" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ color: c.muted, fontWeight: 500, fontSize: "14px", textDecoration: "none" }}>
                {label}
              </Link>
            ))}
          </div>
          <Link href="/register" style={{ backgroundColor: c.primary, color: "#fff", fontSize: "13px", fontWeight: 600, padding: "8px 18px", borderRadius: "6px", textDecoration: "none" }}>
            Get Started
          </Link>
        </div>
      </nav>

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
                  <span style={{ color: c.muted, fontSize: "14px", fontWeight: 400, marginLeft: "8px" }}>FOB {seller?.city ?? "Dubai"}</span>
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
                  { icon: Calendar, label: "Year",        value: listing.year?.toString() ?? "—" },
                  { icon: Gauge,    label: "Mileage",     value: listing.mileage_km != null ? `${Number(listing.mileage_km).toLocaleString()} km` : "—" },
                  { icon: Hash,     label: "Chassis / VIN", value: listing.chassis_number ?? "—" },
                  { icon: Hash,     label: "Engine",      value: listing.engine_size ?? "—" },
                  { icon: Car,      label: "Steering",    value: listing.steering ?? "—" },
                  { icon: MapPin,   label: "Origin",      value: `${seller?.city ?? "Dubai"}, UAE` },
                  { icon: Clock,    label: "ETA",         value: listing.eta_date ? formatDate(listing.eta_date) : "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon style={{ color: c.muted, flexShrink: 0, width: "15px", height: "15px", marginTop: "2px" }} />
                    <div>
                      <dt style={{ color: c.muted, fontSize: "11px", fontWeight: 600 }}>{label}</dt>
                      <dd style={{ color: c.primary, fontSize: "13px", fontWeight: 600, marginTop: "2px", fontVariantNumeric: "tabular-nums" }}>{value}</dd>
                    </div>
                  </div>
                ))}
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
                  <p style={{ color: c.muted, fontSize: "12px" }}>{seller?.city}, UAE</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Shield style={{ color: c.green, width: "14px", height: "14px" }} />
                <span style={{ color: c.greenText, fontWeight: 600, fontSize: "12px" }}>Verified UAE exporter</span>
              </div>
              {seller?.description && (
                <p style={{ color: c.muted, fontSize: "12px", lineHeight: 1.6 }} className="line-clamp-3">
                  {seller.description}
                </p>
              )}
            </div>

            {/* Inquiry */}
            <InquiryForm
              listingId={listing.id}
              sellerId={listing.seller_id}
              listingTitle={`${listing.year} ${listing.make} ${listing.model}`}
              currentUser={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
