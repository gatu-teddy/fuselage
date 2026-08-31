import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { DEAL_STATUS_LABELS, type DealStatus } from "@/lib/types";
import { formatUSD, formatDate } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, MapPin, Bike, ClipboardList } from "lucide-react";
import { c } from "@/lib/tokens";

// ── Status chip colours (inline, no Tailwind colour classes) ─────────────────
const STATUS_STYLE: Record<DealStatus, { bg: string; text: string }> = {
  inquired:          { bg: "#DBEAFE", text: "#1D4ED8" },
  negotiating:       { bg: "#FEF9C3", text: "#854D0E" },
  agreed:            { bg: "#EDE9FE", text: "#6D28D9" },
  payment_uploaded:  { bg: "#FFEDD5", text: "#C2410C" },
  payment_confirmed: { bg: "#CCFBF1", text: "#0F766E" },
  shipped:           { bg: "#E0E7FF", text: "#4338CA" },
  delivered:         { bg: "#DCFCE7", text: "#15803D" },
  completed:         { bg: "#D1FAE5", text: "#065F46" },
  cancelled:         { bg: "#FEE2E2", text: "#991B1B" },
};

export default async function BuyerDealsPage() {
  const userId = (await headers()).get("x-user-id");
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("kyc_status")
    .eq("id", userId)
    .single();

  const kycStatus = profile?.kyc_status ?? "unverified";

  const { data: deals } = await supabase
    .from("deals")
    .select("*, listing:listings(make, model, year, images:listing_images(url, is_primary)), seller:seller_profiles(company_name, city, country)")
    .eq("buyer_id", userId)
    .order("updated_at", { ascending: false });

  const active = deals?.filter((d) => !["completed", "cancelled"].includes(d.status)) ?? [];
  const closed = deals?.filter((d) =>  ["completed", "cancelled"].includes(d.status)) ?? [];

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>

        {/* ── KYC banner ── */}
        {kycStatus === "unverified" && (
          <div style={{ backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderLeft: `4px solid ${c.primary}`, borderRadius: "10px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <ShieldCheck style={{ color: c.primary, width: "20px", height: "20px", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p style={{ color: c.primary, fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>Verify your identity</p>
                <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.5 }}>
                  Get a Verified Buyer badge — sellers respond faster and you gain access to dispute protection.
                </p>
              </div>
            </div>
            <Link href="/buyer/kyc" style={{ backgroundColor: c.primary, color: "#fff", fontSize: "13px", fontWeight: 700, padding: "8px 18px", borderRadius: "7px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              Verify now →
            </Link>
          </div>
        )}

        {kycStatus === "pending" && (
          <div style={{ backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "10px", padding: "14px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck style={{ color: c.amber, width: "18px", height: "18px", flexShrink: 0 }} />
            <p style={{ color: "#92400E", fontSize: "13px", fontWeight: 600 }}>
              Your identity verification is under review — typically 1–2 business days.
            </p>
          </div>
        )}

        {/* ── Page header ── */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <ClipboardList style={{ color: c.primary, width: "20px", height: "20px" }} />
            <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.4px" }}>My deals</h1>
          </div>
          <p style={{ color: c.muted, fontSize: "13px" }}>
            {active.length} active · {closed.length} closed
          </p>
        </div>

        {/* ── Empty state ── */}
        {deals?.length === 0 && (
          <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "64px 40px", textAlign: "center" }}>
            <div style={{ backgroundColor: c.bgDim, width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Bike style={{ color: c.muted, width: "24px", height: "24px" }} />
            </div>
            <p style={{ color: c.primary, fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>No deals yet</p>
            <p style={{ color: c.muted, fontSize: "13px", marginBottom: "20px" }}>
              Browse verified exporters and send an inquiry to start a deal.
            </p>
            <Link href="/browse" style={{ backgroundColor: c.primary, color: "#fff", fontSize: "13px", fontWeight: 700, padding: "10px 22px", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}>
              Browse vehicles →
            </Link>
          </div>
        )}

        {/* ── Active ── */}
        {active.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
              Active ({active.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {active.map((deal) => <DealCard key={deal.id} deal={deal} />)}
            </div>
          </div>
        )}

        {/* ── Closed ── */}
        {closed.length > 0 && (
          <div>
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
              Closed ({closed.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {closed.map((deal) => <DealCard key={deal.id} deal={deal} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: Record<string, unknown> }) {
  const listing      = deal.listing as { make: string; model: string; year: number; images?: { url: string; is_primary: boolean }[] };
  const seller       = deal.seller  as { company_name: string; city: string; country?: string };
  const status       = deal.status as DealStatus;
  const statusStyle  = STATUS_STYLE[status] ?? { bg: c.bgDim, text: c.muted };
  const primaryImage = listing?.images?.find((i) => i.is_primary)?.url ?? listing?.images?.[0]?.url;
  const isClosed     = ["completed", "cancelled"].includes(status);

  return (
    <Link href={`/buyer/deals/${deal.id as string}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          backgroundColor: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          opacity: isClosed ? 0.75 : 1,
          transition: "box-shadow 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
      >
        {/* Thumbnail */}
        <div style={{ width: "80px", height: "58px", borderRadius: "7px", overflow: "hidden", backgroundColor: c.bgDim, flexShrink: 0, position: "relative" }}>
          {primaryImage ? (
            <Image src={primaryImage} alt="" fill style={{ objectFit: "cover" }} sizes="80px" />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bike style={{ color: c.muted, width: "20px", height: "20px", opacity: 0.4 }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: c.primary, fontSize: "14px", fontWeight: 700, marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {listing?.year} {listing?.make} {listing?.model}
          </p>
          <p style={{ color: c.muted, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
            <CheckCircle2 style={{ color: c.green, width: "11px", height: "11px", flexShrink: 0 }} />
            {seller?.company_name}{seller?.city ? ` · ${seller.city}` : ""}
          </p>
          <p style={{ color: c.muted, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin style={{ width: "11px", height: "11px", flexShrink: 0 }} />
            {deal.destination_country as string} · {formatDate(deal.created_at as string)}
          </p>
        </div>

        {/* Price + status */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
          {deal.agreed_price_usd != null && (
            <p style={{ color: c.primary, fontSize: "14px", fontWeight: 800 }}>
              {formatUSD(deal.agreed_price_usd as number)}
            </p>
          )}
          <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "99px", whiteSpace: "nowrap" }}>
            {DEAL_STATUS_LABELS[status]}
          </span>
        </div>
      </div>
    </Link>
  );
}
