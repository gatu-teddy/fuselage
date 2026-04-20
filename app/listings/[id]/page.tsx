import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuyerNav } from "@/components/layouts/buyer-nav";
import { InquiryForm } from "@/components/listings/inquiry-form";
import { Shield, MapPin, Calendar, Hash, Gauge, Clock, CheckCircle } from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: listing }, { data: { user } }] = await Promise.all([
    supabase
      .from("listings")
      .select("*, images:listing_images(*), seller:seller_profiles(*, profile:profiles(full_name, email))")
      .eq("id", id)
      .eq("status", "active")
      .single(),
    supabase.auth.getUser(),
  ]);

  if (!listing) notFound();

  const images = listing.images as { id: string; url: string; is_primary: boolean; position: number }[];
  const sortedImages = images?.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  const seller = listing.seller as {
    company_name: string;
    city: string;
    description: string;
    status: string;
    website?: string;
  };

  const availabilityLabel: Record<string, string> = {
    in_stock: "In stock — ready to ship",
    en_route: "En route — already shipped",
    pre_order: "Pre-order — can be sourced",
  };

  const availabilityColor: Record<string, "success" | "warning" | "secondary"> = {
    in_stock: "success",
    en_route: "warning",
    pre_order: "secondary",
  };

  return (
    <div className="min-h-screen">
      <BuyerNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4">
          <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to browse
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: images + details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div>
              <div className="aspect-[16/9] bg-muted rounded-xl overflow-hidden mb-2">
                {sortedImages?.[0] ? (
                  <img
                    src={sortedImages[0].url}
                    alt={`${listing.year} ${listing.make} ${listing.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No photos available
                  </div>
                )}
              </div>
              {sortedImages?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {sortedImages.slice(1).map((img) => (
                    <div key={img.id} className="w-20 h-14 rounded-md overflow-hidden shrink-0 bg-muted">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title & price */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {listing.year} {listing.make} {listing.model}
                </h1>
                {listing.color && (
                  <div className="text-muted-foreground mt-0.5">{listing.color}</div>
                )}
              </div>
              <Badge variant={availabilityColor[listing.availability]} className="mt-1">
                {availabilityLabel[listing.availability]}
              </Badge>
            </div>

            <div className="text-3xl font-bold">
              {formatUSD(listing.price_usd)}
              <span className="text-base font-normal text-muted-foreground ml-2">FOB Dubai</span>
            </div>

            {/* Specs grid */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Specifications</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {[
                    { icon: Calendar, label: "Year", value: listing.year },
                    { icon: Gauge, label: "Mileage", value: listing.mileage_km != null ? `${listing.mileage_km.toLocaleString()} km` : "—" },
                    { icon: Hash, label: "Chassis / VIN", value: listing.chassis_number ?? "—" },
                    { icon: Hash, label: "Engine", value: listing.engine_size ?? "—" },
                    { icon: Clock, label: "ETA", value: listing.eta_date ? formatDate(listing.eta_date) : "—" },
                    { icon: MapPin, label: "Origin", value: `${seller?.city}, UAE` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-muted-foreground text-xs">{label}</dt>
                        <dd className="font-medium font-mono text-xs mt-0.5">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Features */}
            {listing.features?.length > 0 && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Features</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(listing.features as string[]).map((f) => (
                      <div key={f} className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {listing.description && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Description</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Destination ports */}
            {listing.destination_ports?.length > 0 && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Ships to</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(listing.destination_ports as string[]).map((port) => (
                      <div key={port} className="flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs">
                        <MapPin className="h-3 w-3 text-gold-500" />
                        {port}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: exporter info + inquiry */}
          <div className="space-y-4">
            {/* Exporter card */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {seller?.company_name?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{seller?.company_name}</div>
                    <div className="text-xs text-muted-foreground">{seller?.city}, UAE</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs mb-3">
                  <Shield className="h-3.5 w-3.5 text-gold-500" />
                  <span className="text-gold-600 font-medium">Verified UAE exporter</span>
                </div>
                {seller?.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3">{seller.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Inquiry form */}
            <InquiryForm
              listingId={listing.id}
              sellerId={listing.seller_id}
              listingTitle={`${listing.year} ${listing.make} ${listing.model}`}
              currentUser={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
