import { createPublicClient } from "@/lib/supabase/public";

// Cache this page for 60 s — no auth needed, safe to reuse across visitors
export const revalidate = 60;
import Link from "next/link";
import { BrowseFilters } from "@/components/listings/browse-filters";
import { ListingCard } from "@/components/listings/listing-card";
import { c } from "@/lib/tokens";

interface SearchParams {
  type?: string;
  make?: string;
  availability?: string;
  port?: string;
  min?: string;
  max?: string;
  steering?: string;
  q?: string;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  let listings: any[] | null = null;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = createPublicClient();

      let query = supabase
        .from("listings")
        .select(
          "*, images:listing_images(url, is_primary), seller:seller_profiles(id, company_name, city, status, plan, website)"
        )
        .eq("status", "active");

      if (params.type)         query = query.eq("type", params.type);
      if (params.make)         query = query.eq("make", params.make);
      if (params.availability) query = query.eq("availability", params.availability);
      if (params.min)          query = query.gte("price_usd", params.min);
      if (params.max)          query = query.lte("price_usd", params.max);
      if (params.port)         query = query.contains("destination_ports", [params.port]);
      if (params.steering)     query = query.eq("steering", params.steering);
      if (params.q)            query = query.or(`make.ilike.%${params.q}%,model.ilike.%${params.q}%`);

      const { data } = await query.order("created_at", { ascending: false });
      listings = data;
    } catch {
      listings = [];
    }
  }

  return (
    <>

      {/* ── PAGE BODY ───────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 md:py-10">
        <div className="flex items-start gap-8">

          {/* ── Filters sidebar — desktop only ──────────────────────────── */}
          <aside
            className="hidden md:block"
            style={{
              width: "240px",
              flexShrink: 0,
              backgroundColor: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "0.5rem",
              padding: "20px",
            }}
          >
            <BrowseFilters currentParams={params} />
          </aside>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Header row */}
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
              <div className="min-w-0">
                <h1 style={{ color: c.primary }} className="text-xl md:text-2xl font-bold tracking-tight">
                  {"Motorbikes"}
                </h1>
                <p style={{ color: c.muted }} className="text-sm mt-0.5">
                  {listings?.length ?? 0}{" "}
                  {`${listings?.length ?? 0} motorbike${(listings?.length ?? 0) !== 1 ? "s" : ""} available`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile filter button */}
                <BrowseFilters currentParams={params} mobileOnly={true} />
                <div
                  style={{ border: `1px solid ${c.border}`, borderRadius: "6px", backgroundColor: c.surface }}
                  className="hidden md:flex items-center gap-2 px-3 h-9"
                >
                  <span style={{ color: c.muted }} className="text-xs">Sort by:</span>
                  <span style={{ color: c.primary }} className="text-xs font-semibold">Newest First</span>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {(!listings || listings.length === 0) && (
              <div
                style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
                className="text-center py-20"
              >
                <p style={{ color: c.muted }} className="mb-2">
                  {"No motorbike listings match your filters."}
                </p>
                <p style={{ color: c.muted, fontSize: "12px" }} className="mb-6">
                  {"Be the first — sellers can list motorbikes from their portal."}
                </p>
                <Link
                  href={params.type ? `/browse?type=${params.type}` : "/browse"}
                  style={{ backgroundColor: c.primary, color: "#fff" }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-9 rounded hover:opacity-90 transition-opacity"
                >
                  Clear filters
                </Link>
              </div>
            )}

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {listings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination stub */}
            {listings && listings.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {[1, 2, 3].map((p) => (
                  <div
                    key={p}
                    style={{
                      width: "36px", height: "36px", borderRadius: "6px",
                      border: `1px solid ${p === 1 ? c.primary : c.border}`,
                      backgroundColor: p === 1 ? c.primary : c.surface,
                      color: p === 1 ? "#fff" : c.body,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: p === 1 ? "600" : "400",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
