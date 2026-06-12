import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Eye } from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";

export default async function SellerListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: listings } = await supabase
    .from("listings")
    .select("*, images:listing_images(url, is_primary)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const statusVariant: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
    active: "success",
    draft: "secondary",
    reserved: "warning",
    sold: "destructive",
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {listings?.length ?? 0} vehicle{listings?.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/seller/listings/bulk">
              Bulk import CSV
            </Link>
          </Button>
          <Button asChild>
            <Link href="/seller/listings/new">
              <Plus className="h-4 w-4 mr-1" /> Add listing
            </Link>
          </Button>
        </div>
      </div>

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
                  <div className="font-semibold">
                    {listing.year} {listing.make} {listing.model}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span>{formatUSD(listing.price_usd)}</span>
                    <span>·</span>
                    <span className="capitalize">{listing.type}</span>
                    <span>·</span>
                    <span className="capitalize">{listing.availability.replace("_", " ")}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Added {formatDate(listing.created_at)}
                  </div>
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
