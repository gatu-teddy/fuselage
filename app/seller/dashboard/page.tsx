import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, ClipboardList, Plus, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";
import { DEAL_STATUS_LABELS, DEAL_STATUS_COLORS } from "@/lib/types";

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: sellerProfile }, { data: listings }, { data: deals }] = await Promise.all([
    supabase.from("seller_profiles").select("*, profile:profiles(*)").eq("id", user.id).single(),
    supabase.from("listings").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("deals").select("*, listing:listings(make,model,year), buyer:profiles(full_name,country)").eq("seller_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);

  if (!sellerProfile) redirect("/seller/onboarding");

  const activeListings = listings?.filter((l) => l.status === "active").length ?? 0;
  const totalDeals = deals?.length ?? 0;
  const pendingDeals = deals?.filter((d) => !["completed", "cancelled"].includes(d.status)).length ?? 0;

  const statusInfo = {
    pending: { label: "Pending verification", color: "warning", icon: Clock },
    verified: { label: "Verified exporter", color: "success", icon: CheckCircle },
    rejected: { label: "Application rejected", color: "destructive", icon: AlertTriangle },
    suspended: { label: "Account suspended", color: "destructive", icon: AlertTriangle },
  }[sellerProfile.status as string] ?? { label: sellerProfile.status, color: "outline", icon: Clock };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{sellerProfile.company_name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{sellerProfile.city}, UAE</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusInfo.color as "warning" | "success" | "destructive" | "outline"} className="gap-1.5 px-3 py-1">
            <statusInfo.icon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
          {sellerProfile.status === "verified" && (
            <Button size="sm" asChild>
              <Link href="/seller/listings/new">
                <Plus className="h-4 w-4 mr-1" /> Add listing
              </Link>
            </Button>
          )}
        </div>
      </div>

      {sellerProfile.status === "pending" && (
        <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 flex items-start gap-3">
          <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-yellow-800 text-sm">Verification in progress</div>
            <div className="text-yellow-700 text-sm">
              Our team is reviewing your trade license and company details. This usually takes 1–2 business days.
            </div>
          </div>
        </div>
      )}

      {sellerProfile.status === "rejected" && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <div className="font-medium text-red-800 text-sm">Application not approved</div>
          {sellerProfile.rejection_reason && (
            <div className="text-red-700 text-sm mt-1">Reason: {sellerProfile.rejection_reason}</div>
          )}
          <div className="text-red-700 text-sm mt-1">Please contact support to reapply.</div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Car className="h-4 w-4" /> Active listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeListings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Active deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingDeals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDeals}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent listings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/listings">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {listings?.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No listings yet.</p>
            )}
            {listings?.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-medium text-sm">{listing.year} {listing.make} {listing.model}</div>
                  <div className="text-xs text-muted-foreground">{formatUSD(listing.price_usd)}</div>
                </div>
                <Badge
                  variant={listing.status === "active" ? "success" : "secondary"}
                  className="text-xs capitalize"
                >
                  {listing.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent deals</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/deals">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {deals?.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No deals yet.</p>
            )}
            {deals?.map((deal) => (
              <Link key={deal.id} href={`/seller/deals/${deal.id}`}>
                <div className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/50 rounded px-2 -mx-2 transition-colors">
                  <div>
                    <div className="font-medium text-sm">
                      {(deal.listing as { year: number; make: string; model: string })?.year}{" "}
                      {(deal.listing as { year: number; make: string; model: string })?.make}{" "}
                      {(deal.listing as { year: number; make: string; model: string })?.model}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(deal.buyer as { full_name: string; country: string })?.full_name} · {deal.destination_country}
                    </div>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${DEAL_STATUS_COLORS[deal.status as keyof typeof DEAL_STATUS_COLORS]}`}>
                    {DEAL_STATUS_LABELS[deal.status as keyof typeof DEAL_STATUS_LABELS]}
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
