import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DEAL_STATUS_LABELS, DEAL_STATUS_COLORS, type DealStatus } from "@/lib/types";
import { formatUSD, formatDate } from "@/lib/utils";

export default async function SellerDealsPage() {
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

  function DealRow({ deal }: { deal: typeof deals extends (infer T)[] | null ? T : never }) {
    const listing = deal.listing as { make: string; model: string; year: number };
    const buyer = deal.buyer as { full_name: string; country: string; email: string };
    return (
      <Link href={`/seller/deals/${deal.id}`}>
        <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors">
          <div className="min-w-0">
            <div className="font-medium text-sm">{listing?.year} {listing?.make} {listing?.model}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {buyer?.full_name} · {deal.destination_country} · {formatDate(deal.created_at)}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 ml-4">
            {deal.agreed_price_usd && (
              <span className="text-sm font-medium">{formatUSD(deal.agreed_price_usd)}</span>
            )}
            <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${DEAL_STATUS_COLORS[deal.status as DealStatus]}`}>
              {DEAL_STATUS_LABELS[deal.status as DealStatus]}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Deals</h1>
        <p className="text-muted-foreground text-sm mt-1">{active.length} active · {closed.length} closed</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Active ({active.length})
          </h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {active.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No active deals.</p>
              )}
              {active.map((deal) => <DealRow key={deal.id} deal={deal} />)}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Closed ({closed.length})
          </h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {closed.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No closed deals yet.</p>
              )}
              {closed.map((deal) => <DealRow key={deal.id} deal={deal} />)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
