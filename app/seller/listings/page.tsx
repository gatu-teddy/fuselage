import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Eye, Zap } from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";
import { getPlan } from "@/lib/plans";

import { c } from "@/lib/tokens";

export default async function SellerListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: listings }, { data: profile }] = await Promise.all([
    supabase.from("listings")
      .select("*, images:listing_images(url, is_primary)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("seller_profiles").select("plan").eq("id", user.id).single(),
  ]);

  const plan = getPlan(profile?.plan);
  const used = listings?.length ?? 0;
  const limit = plan.listingLimit;
  const limitIsFinite = limit !== Infinity;
  const pct = limitIsFinite ? Math.min((used / (limit as number)) * 100, 100) : 0;
  const nearLimit = limitIsFinite && used >= (limit as number) * 0.8;
  const atLimit   = limitIsFinite && used >= (limit as number);

  const statusVariant: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
    active: "success", draft: "secondary", reserved: "warning", sold: "destructive",
  };

  return (
    <div className="p-8 max-w-5xl">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {used} vehicle{used !== 1 ? "s" : ""} listed
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          {plan.bulkImport && (
            <Button asChild variant="outline">
              <Link href="/seller/listings/bulk">Bulk import CSV</Link>
            </Button>
          )}
          <Button asChild disabled={atLimit}>
            <Link href={atLimit ? "#" : "/seller/listings/new"}>
              <Plus className="h-4 w-4 mr-1" /> Add listing
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Plan usage bar ────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: c.surface,
          border: `1px solid ${atLimit ? c.amber : nearLimit ? "#FDE68A" : c.border}`,
          borderRadius: "10px", padding: "14px 18px", marginBottom: "20px",
          display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
        }}
      >
        {/* Plan badge */}
        <span
          style={{
            backgroundColor: plan.bg, color: plan.textColor, border: `1px solid ${plan.border}`,
            fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px",
            textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0,
          }}
        >
          {plan.label}
        </span>

        {/* Bar + count */}
        {limitIsFinite ? (
          <div className="flex-1 min-w-0">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ color: c.muted, fontSize: "12px" }}>
                <strong style={{ color: atLimit ? c.amber : c.primary }}>{used}</strong> / {limit as number} listings used
              </span>
              {atLimit && (
                <span style={{ color: c.amber, fontSize: "11px", fontWeight: 700 }}>Limit reached</span>
              )}
              {nearLimit && !atLimit && (
                <span style={{ color: c.amber, fontSize: "11px", fontWeight: 600 }}>
                  {(limit as number) - used} remaining
                </span>
              )}
            </div>
            <div style={{ backgroundColor: "#F1F5F9", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%", width: `${pct}%`,
                  backgroundColor: atLimit ? c.amber : nearLimit ? c.amber : c.green,
                  borderRadius: "99px", transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ) : (
          <span style={{ color: c.muted, fontSize: "13px" }}>Unlimited listings</span>
        )}

        {/* Upgrade CTA */}
        {(atLimit || nearLimit) && profile?.plan !== "enterprise" && (
          <Link
            href="/seller/upgrade"
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              backgroundColor: c.primary, color: "#fff", fontSize: "12px",
              fontWeight: 700, padding: "7px 14px", borderRadius: "6px",
              textDecoration: "none", flexShrink: 0,
            }}
          >
            <Zap style={{ width: "12px", height: "12px" }} /> Upgrade
          </Link>
        )}
      </div>

      {/* ── Bulk import CTA for free plan ─────────────────────────────────── */}
      {!plan.bulkImport && (
        <div
          style={{
            backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE",
            borderRadius: "8px", padding: "10px 16px", marginBottom: "16px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
          }}
        >
          <p style={{ color: "#1D4ED8", fontSize: "13px" }}>
            💡 <strong>Growth plan</strong> unlocks bulk CSV import — add 50+ vehicles in seconds.
          </p>
          <Link
            href="/seller/upgrade"
            style={{ color: "#1D4ED8", fontSize: "12px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
          >
            Upgrade →
          </Link>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {listings?.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">No listings yet. Add your first vehicle.</p>
            <Button asChild>
              <Link href="/seller/listings/new">
                <Plus className="h-4 w-4 mr-1" /> Add first listing
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Listing cards ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {listings?.map((listing) => {
          const primaryImage = (listing.images as { url: string; is_primary: boolean }[])?.find((i) => i.is_primary)?.url
            ?? (listing.images as { url: string }[])?.[0]?.url;

          return (
            <Card key={listing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-20 h-14 rounded-md bg-muted overflow-hidden shrink-0">
                  {primaryImage ? (
                    <img src={primaryImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No photo
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{listing.year} {listing.make} {listing.model}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span>{formatUSD(listing.price_usd)}</span>
                    <span>·</span>
                    <span className="capitalize">{listing.type}</span>
                    <span>·</span>
                    <span className="capitalize">{listing.availability.replace("_", " ")}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Added {formatDate(listing.created_at)}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={statusVariant[listing.status] ?? "secondary"} className="capitalize">
                    {listing.status}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/seller/listings/${listing.id}/edit`}>
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/listings/${listing.id}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
