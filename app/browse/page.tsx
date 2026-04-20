import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BuyerNav } from "@/components/layouts/buyer-nav";
import { Shield, MapPin, Clock } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { VEHICLE_MAKES } from "@/lib/types";
import { BrowseFilters } from "@/components/listings/browse-filters";

interface SearchParams {
  type?: string;
  make?: string;
  availability?: string;
  port?: string;
  min?: string;
  max?: string;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(
      "*, images:listing_images(url, is_primary), seller:seller_profiles(company_name, city, status)"
    )
    .eq("status", "active");

  if (params.type) query = query.eq("type", params.type);
  if (params.make) query = query.eq("make", params.make);
  if (params.availability) query = query.eq("availability", params.availability);
  if (params.min) query = query.gte("price_usd", params.min);
  if (params.max) query = query.lte("price_usd", params.max);
  if (params.port) query = query.contains("destination_ports", [params.port]);

  const { data: listings } = await query.order("created_at", { ascending: false });

  const availabilityLabel: Record<string, string> = {
    in_stock: "In stock",
    en_route: "En route",
    pre_order: "Pre-order",
  };

  const availabilityColor: Record<string, string> = {
    in_stock: "success",
    en_route: "warning",
    pre_order: "secondary",
  };

  return (
    <div className="min-h-screen">
      <BuyerNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start gap-8">
          {/* Filters sidebar */}
          <div className="w-60 shrink-0">
            <BrowseFilters currentParams={params} />
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold">Browse vehicles</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {listings?.length ?? 0} listings from verified UAE exporters
                </p>
              </div>
            </div>

            {listings?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No listings match your filters.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/browse">Clear filters</Link>
                </Button>
              </div>
            )}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings?.map((listing) => {
                const images = listing.images as { url: string; is_primary: boolean }[];
                const primaryImage = images?.find((i) => i.is_primary)?.url ?? images?.[0]?.url;
                const seller = listing.seller as { company_name: string; city: string; status: string };

                return (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="aspect-[4/3] bg-muted overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={`${listing.year} ${listing.make} ${listing.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            No photo
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="font-semibold text-sm leading-tight">
                              {listing.year} {listing.make} {listing.model}
                            </div>
                            {listing.color && (
                              <div className="text-xs text-muted-foreground mt-0.5">{listing.color}</div>
                            )}
                          </div>
                          <Badge
                            variant={availabilityColor[listing.availability] as "success" | "warning" | "secondary"}
                            className="text-xs shrink-0"
                          >
                            {availabilityLabel[listing.availability]}
                          </Badge>
                        </div>

                        <div className="text-lg font-bold text-primary mb-3">
                          {formatUSD(listing.price_usd)}
                          <span className="text-xs font-normal text-muted-foreground ml-1">FOB Dubai</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-gold-500" />
                            <span className="truncate max-w-[120px]">{seller?.company_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {seller?.city}
                          </div>
                        </div>

                        {listing.eta_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                            <Clock className="h-3 w-3" />
                            ETA: {new Date(listing.eta_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        )}

                        {listing.destination_ports?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(listing.destination_ports as string[]).slice(0, 3).map((port) => (
                              <span key={port} className="text-xs bg-muted rounded px-1.5 py-0.5">{port}</span>
                            ))}
                            {listing.destination_ports.length > 3 && (
                              <span className="text-xs bg-muted rounded px-1.5 py-0.5">+{listing.destination_ports.length - 3}</span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
