import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DEAL_STATUS_LABELS, DEAL_STATUS_COLORS, type DealStatus } from "@/lib/types";
import { formatUSD, formatDate } from "@/lib/utils";
import { Shield, ShieldCheck } from "lucide-react";
import { c } from "@/lib/tokens";

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
    .select(
      "*, listing:listings(make, model, year, images:listing_images(url, is_primary)), seller:seller_profiles(company_name, city, country)"
    )
    .eq("buyer_id", userId)
    .order("updated_at", { ascending: false });

  const active = deals?.filter((d) => !["completed", "cancelled"].includes(d.status)) ?? [];
  const closed = deals?.filter((d) => ["completed", "cancelled"].includes(d.status)) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

        {/* KYC prompt banner */}
        {kycStatus === "unverified" && (
          <div style={{
            backgroundColor: c.bgDim,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.primary}`,
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <ShieldCheck style={{ color: c.primary, width: "20px", height: "20px", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p style={{ color: c.primary, fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>
                  Verify your identity
                </p>
                <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.5 }}>
                  Get a Verified Buyer badge — sellers respond faster and you gain access to dispute protection.
                </p>
              </div>
            </div>
            <Link
              href="/buyer/kyc"
              style={{
                backgroundColor: c.primary,
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: "7px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Verify now →
            </Link>
          </div>
        )}

        {kycStatus === "pending" && (
          <div style={{
            backgroundColor: c.amberBg,
            border: `1px solid ${c.amberBorder}`,
            borderRadius: "10px",
            padding: "14px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <ShieldCheck style={{ color: c.amber, width: "18px", height: "18px", flexShrink: 0 }} />
            <p style={{ color: "#92400E", fontSize: "13px", fontWeight: 600 }}>
              Your identity verification is under review — typically 1–2 business days.
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold">My deals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {active.length} active · {closed.length} closed
          </p>
        </div>

        {deals?.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">
                You have no deals yet. Browse vehicles and send an inquiry to start.
              </p>
              <Link href="/browse" className="text-primary font-medium hover:underline text-sm">
                Browse vehicles →
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Active ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map((deal) => <DealCard key={deal.id} deal={deal} />)}
              </div>
            </div>
          )}

          {closed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Closed ({closed.length})
              </h2>
              <div className="space-y-3">
                {closed.map((deal) => <DealCard key={deal.id} deal={deal} />)}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

function DealCard({ deal }: { deal: Record<string, unknown> }) {
  const listing = deal.listing as { make: string; model: string; year: number; images?: { url: string; is_primary: boolean }[] };
  const seller = deal.seller as { company_name: string; city: string; country?: string };
  const primaryImage = listing?.images?.find((i) => i.is_primary)?.url ?? listing?.images?.[0]?.url;

  return (
    <Link href={`/buyer/deals/${deal.id as string}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-20 h-14 rounded-md bg-muted overflow-hidden shrink-0">
            {primaryImage ? (
              <img src={primaryImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No photo</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">
              {listing?.year} {listing?.make} {listing?.model}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Shield className="h-3 w-3 text-gold-500" />
              {seller?.company_name}{seller?.city ? ` · ${seller.city}` : ""}{seller?.country ? `, ${seller.country}` : ""}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {deal.destination_country as string} · {formatDate(deal.created_at as string)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {deal.agreed_price_usd != null && (
              <div className="text-sm font-semibold">{formatUSD(deal.agreed_price_usd as number)}</div>
            )}
            <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${DEAL_STATUS_COLORS[deal.status as DealStatus]}`}>
              {DEAL_STATUS_LABELS[deal.status as DealStatus]}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
