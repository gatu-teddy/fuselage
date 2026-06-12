import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Car, TrendingUp, Plus, CheckCircle, Clock, AlertTriangle, DollarSign, Eye, BarChart2, ArrowRight } from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";
import { DEAL_STATUS_LABELS, type DealStatus } from "@/lib/types";

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
  blue:      "#3B82F6",
  blueBg:    "#DBEAFE",
};

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: sellerProfile }, { data: listings }, { data: deals }] = await Promise.all([
    supabase.from("seller_profiles").select("*, profile:profiles(*)").eq("id", user.id).single(),
    supabase.from("listings").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
    supabase.from("deals").select("*, listing:listings(make,model,year), buyer:profiles(full_name,country)")
      .eq("seller_id", user.id).order("created_at", { ascending: false }),
  ]);

  if (!sellerProfile) redirect("/seller/onboarding");

  // ── Metrics ────────────────────────────────────────────────────────────────
  const activeListings   = listings?.filter((l) => l.status === "active").length ?? 0;
  const totalDeals       = deals?.length ?? 0;
  const activeSales      = deals?.filter((d) => !["completed", "cancelled"].includes(d.status)) ?? [];
  const completedSales   = deals?.filter((d) => d.status === "completed") ?? [];
  const pipelineValue    = activeSales.reduce((sum, d) => sum + (Number(d.agreed_price_usd) || 0), 0);
  const totalRevenue     = completedSales.reduce((sum, d) => sum + (Number(d.agreed_price_usd) || 0), 0);

  // Most active listing (most deals)
  const dealsByListing = deals?.reduce((acc, d) => {
    const id = d.listing_id as string;
    acc[id] = (acc[id] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};
  const topListingId = Object.entries(dealsByListing).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
  const topListing   = listings?.find((l) => l.id === topListingId);
  const topListingDeals = topListingId ? dealsByListing[topListingId] : 0;

  // Recent 5 listings & sales
  const recentListings = listings?.slice(0, 5) ?? [];
  const recentDeals    = deals?.slice(0, 5) ?? [];

  // Status badge info
  const statusInfo = {
    pending:   { label: "Pending verification", color: c.amber,   bg: c.amberBg,  icon: Clock },
    verified:  { label: "Verified exporter",    color: c.green,   bg: c.greenBg,  icon: CheckCircle },
    rejected:  { label: "Application rejected", color: "#EF4444", bg: "#FEE2E2",  icon: AlertTriangle },
    suspended: { label: "Account suspended",    color: "#EF4444", bg: "#FEE2E2",  icon: AlertTriangle },
  }[sellerProfile.status as string] ?? { label: sellerProfile.status, color: c.muted, bg: c.bgDim, icon: Clock };

  const StatusIcon = statusInfo.icon;

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-5xl">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            {sellerProfile.company_name}
          </h1>
          <p style={{ color: c.muted, fontSize: "14px", marginTop: "4px" }}>{sellerProfile.city}{sellerProfile.country ? `, ${sellerProfile.country}` : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ backgroundColor: statusInfo.bg, color: statusInfo.color, fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <StatusIcon style={{ width: "12px", height: "12px" }} />
            {statusInfo.label}
          </span>
          {sellerProfile.status === "verified" && (
            <Link
              href="/seller/listings/new"
              style={{ backgroundColor: c.primary, color: "#fff", fontSize: "13px", fontWeight: 600, padding: "8px 16px", borderRadius: "8px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Plus style={{ width: "14px", height: "14px" }} /> Add listing
            </Link>
          )}
        </div>
      </div>

      {/* Pending / rejected banners */}
      {sellerProfile.status === "pending" && (
        <div style={{ marginBottom: "28px", borderRadius: "10px", border: `1px solid #FDE68A`, backgroundColor: c.amberBg, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <Clock style={{ color: c.amber, width: "18px", height: "18px", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p style={{ color: "#92400E", fontWeight: 600, fontSize: "14px" }}>Verification in progress</p>
            <p style={{ color: "#92400E", fontSize: "13px", marginTop: "2px" }}>Our compliance team is reviewing your documents. This usually takes 1–2 business days.</p>
          </div>
        </div>
      )}
      {sellerProfile.status === "rejected" && (
        <div style={{ marginBottom: "28px", borderRadius: "10px", border: `1px solid #FECACA`, backgroundColor: "#FEF2F2", padding: "14px 18px" }}>
          <p style={{ color: "#991B1B", fontWeight: 600, fontSize: "14px" }}>Application not approved</p>
          {sellerProfile.rejection_reason && <p style={{ color: "#991B1B", fontSize: "13px", marginTop: "4px" }}>Reason: {sellerProfile.rejection_reason}</p>}
          <p style={{ color: "#991B1B", fontSize: "13px", marginTop: "4px" }}>Please contact support to reapply.</p>
        </div>
      )}

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Car,         label: "Active listings",  value: activeListings.toString(),           color: c.primary, bg: c.bgDim   },
          { icon: TrendingUp,  label: "Active sales",     value: activeSales.length.toString(),       color: c.blue,    bg: c.blueBg  },
          { icon: DollarSign,  label: "Pipeline value",   value: pipelineValue ? formatUSD(pipelineValue) : "—", color: c.amber, bg: c.amberBg },
          { icon: BarChart2,   label: "Total revenue",    value: totalRevenue  ? formatUSD(totalRevenue)  : "—", color: c.green, bg: c.greenBg },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ backgroundColor: bg, width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon style={{ color, width: "16px", height: "16px" }} />
              </div>
              <p style={{ color: c.muted, fontSize: "12px", fontWeight: 500 }}>{label}</p>
            </div>
            <p style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Insights row ────────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Top listing */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}>
          <div className="flex items-center gap-2 mb-3">
            <Eye style={{ color: c.green, width: "15px", height: "15px" }} />
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Most inquired</p>
          </div>
          {topListing ? (
            <>
              <p style={{ color: c.primary, fontWeight: 700, fontSize: "14px" }}>{topListing.year} {topListing.make} {topListing.model}</p>
              <p style={{ color: c.muted, fontSize: "12px", marginTop: "4px" }}>{topListingDeals} {topListingDeals === 1 ? "inquiry" : "inquiries"}</p>
              <Link href={`/listings/${topListing.id}`} style={{ color: c.green, fontSize: "12px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "12px" }}>
                View listing <ArrowRight style={{ width: "11px", height: "11px" }} />
              </Link>
            </>
          ) : (
            <p style={{ color: c.muted, fontSize: "13px" }}>No inquiries yet</p>
          )}
        </div>

        {/* Conversion */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 style={{ color: c.blue, width: "15px", height: "15px" }} />
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Conversion</p>
          </div>
          <p style={{ color: c.primary, fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px" }}>
            {totalDeals > 0 && activeListings > 0 ? `${Math.round((totalDeals / activeListings) * 10) / 10}×` : "—"}
          </p>
          <p style={{ color: c.muted, fontSize: "12px", marginTop: "4px" }}>Deals per active listing</p>
          <p style={{ color: c.muted, fontSize: "11px", marginTop: "8px" }}>
            {totalDeals} total {totalDeals === 1 ? "inquiry" : "inquiries"} across {activeListings} {activeListings === 1 ? "listing" : "listings"}
          </p>
        </div>

        {/* Completed sales */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle style={{ color: c.green, width: "15px", height: "15px" }} />
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Completed sales</p>
          </div>
          <p style={{ color: c.primary, fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px" }}>{completedSales.length}</p>
          <p style={{ color: c.muted, fontSize: "12px", marginTop: "4px" }}>
            {completedSales.length > 0 ? `${formatUSD(totalRevenue)} total` : "No completed sales yet"}
          </p>
        </div>
      </div>

      {/* ── Recent listings + sales ──────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent listings */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${c.border}` }}>
            <p style={{ color: c.primary, fontWeight: 700, fontSize: "14px" }}>Recent listings</p>
            <Link href="/seller/listings" style={{ color: c.muted, fontSize: "12px", textDecoration: "none" }} className="hover:text-[#0F172A] transition-colors">
              View all
            </Link>
          </div>
          <div>
            {recentListings.length === 0 ? (
              <p style={{ color: c.muted, fontSize: "13px", textAlign: "center", padding: "32px 0" }}>No listings yet.</p>
            ) : recentListings.map((listing, i) => (
              <div key={listing.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: i < recentListings.length - 1 ? `1px solid ${c.border}` : "none" }}>
                <div>
                  <p style={{ color: c.primary, fontWeight: 600, fontSize: "13px" }}>{listing.year} {listing.make} {listing.model}</p>
                  <p style={{ color: c.muted, fontSize: "12px", marginTop: "2px" }}>{formatUSD(listing.price_usd)}</p>
                </div>
                <span style={{ backgroundColor: listing.status === "active" ? c.greenBg : c.bgDim, color: listing.status === "active" ? c.greenText : c.muted, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", textTransform: "capitalize" }}>
                  {listing.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent sales */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${c.border}` }}>
            <p style={{ color: c.primary, fontWeight: 700, fontSize: "14px" }}>Recent sales</p>
            <Link href="/seller/sales" style={{ color: c.muted, fontSize: "12px", textDecoration: "none" }} className="hover:text-[#0F172A] transition-colors">
              View all
            </Link>
          </div>
          <div>
            {recentDeals.length === 0 ? (
              <p style={{ color: c.muted, fontSize: "13px", textAlign: "center", padding: "32px 0" }}>No sales yet.</p>
            ) : recentDeals.map((deal, i) => {
              const listing = deal.listing as { make: string; model: string; year: number };
              const buyer   = deal.buyer   as { full_name: string; country: string };
              return (
                <Link key={deal.id} href={`/seller/sales/${deal.id}`} style={{ display: "block", textDecoration: "none" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: i < recentDeals.length - 1 ? `1px solid ${c.border}` : "none" }}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: c.primary, fontWeight: 600, fontSize: "13px" }}>{listing?.year} {listing?.make} {listing?.model}</p>
                      <p style={{ color: c.muted, fontSize: "11px", marginTop: "2px" }}>{buyer?.full_name} · {deal.destination_country}</p>
                    </div>
                    <span style={{ color: c.muted, fontSize: "11px", fontWeight: 600, flexShrink: 0, marginLeft: "12px" }}>
                      {DEAL_STATUS_LABELS[deal.status as DealStatus]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
