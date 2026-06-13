import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DEAL_STATUS_LABELS, DEAL_STATUS_COLORS, type DealStatus } from "@/lib/types";
import { formatUSD, formatDate } from "@/lib/utils";
import { Shield } from "lucide-react";

export default async function BuyerDealsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: deals } = await supabase
    .from("deals")
    .select(
      "*, listing:listings(make, model, year, images:listing_images(url, is_primary)), seller:seller_profiles(company_name, city, country)"
    )
    .eq("buyer_id", user.id)
    .order("updated_at", { ascending: false });

  const active = deals?.filter((d) => !["completed", "cancelled"].includes(d.status)) ?? [];
  const closed = deals?.filter((d) => ["completed", "cancelled"].includes(d.status)) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
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
