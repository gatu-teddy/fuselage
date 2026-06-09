import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DEAL_STATUS_LABELS, DEAL_STATUS_COLORS, type DealStatus } from "@/lib/types";
import { formatUSD, formatDate } from "@/lib/utils";

const c = {
  primary: "#0F172A", green: "#10B981", greenBg: "#D1FAE5", greenText: "#065F46",
  bg: "#F8FAFC", surface: "#FFFFFF", border: "#E2E8F0", muted: "#64748B", body: "#334155",
  amber: "#F59E0B", amberBg: "#FEF3C7",
};

export default async function SellerSalesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: deals } = await supabase
    .from("deals")
    .select("*, listing:listings(make, model, year), buyer:profiles(full_name, country, email)")
    .eq("seller_id", user.id)
    .order("updated_at", { ascending: false });

  const active = deals?.filter((d) => !["completed", "cancelled"].includes(d.status)) ?? [];
  const closed = deals?.filter((d) => ["completed", "cancelled"].includes(d.status)) ?? [];

  const statusColor: Record<string, string> = {
    inquired:          "#64748B",
    negotiating:       "#F59E0B",
    agreed:            "#3B82F6",
    payment_uploaded:  "#8B5CF6",
    payment_confirmed: "#10B981",
    shipped:           "#10B981",
    delivered:         "#10B981",
    completed:         "#065F46",
    cancelled:         "#EF4444",
  };
  const statusBg: Record<string, string> = {
    inquired:          "#F1F5F9",
    negotiating:       "#FEF3C7",
    agreed:            "#DBEAFE",
    payment_uploaded:  "#EDE9FE",
    payment_confirmed: "#D1FAE5",
    shipped:           "#D1FAE5",
    delivered:         "#D1FAE5",
    completed:         "#D1FAE5",
    cancelled:         "#FEE2E2",
  };

  function DealRow({ deal }: { deal: NonNullable<typeof deals>[number] }) {
    const listing = deal.listing as { make: string; model: string; year: number };
    const buyer = deal.buyer as { full_name: string; country: string };
    const color = statusColor[deal.status] ?? c.muted;
    const bg    = statusBg[deal.status]    ?? "#F1F5F9";
    return (
      <Link href={`/seller/sales/${deal.id}`} style={{ display: "block", textDecoration: "none" }}>
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${c.border}` }}
          className="hover:bg-[#F8FAFC] transition-colors last:border-0"
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ color: c.primary, fontWeight: 600, fontSize: "14px" }}>{listing?.year} {listing?.make} {listing?.model}</p>
            <p style={{ color: c.muted, fontSize: "12px", marginTop: "2px" }}>
              {buyer?.full_name} · {deal.destination_country} · {formatDate(deal.created_at)}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0, marginLeft: "16px" }}>
            {deal.agreed_price_usd && (
              <span style={{ color: c.primary, fontWeight: 600, fontSize: "14px" }}>{formatUSD(deal.agreed_price_usd)}</span>
            )}
            <span style={{ backgroundColor: bg, color, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>
              {DEAL_STATUS_LABELS[deal.status as DealStatus]}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Sales</h1>
        <p style={{ color: c.muted, fontSize: "14px", marginTop: "4px" }}>{active.length} active · {closed.length} closed</p>
      </div>

      <div className="space-y-8">
        <div>
          <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Active ({active.length})
          </p>
          <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
            {active.length === 0 ? (
              <p style={{ color: c.muted, fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No active sales.</p>
            ) : active.map((deal) => <DealRow key={deal.id} deal={deal} />)}
          </div>
        </div>

        <div>
          <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Closed ({closed.length})
          </p>
          <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
            {closed.length === 0 ? (
              <p style={{ color: c.muted, fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No closed sales yet.</p>
            ) : closed.map((deal) => <DealRow key={deal.id} deal={deal} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
