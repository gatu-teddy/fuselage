/**
 * GET /api/seller/website-click?sellerId=xxx
 *
 * Tracks a buyer click-through to a seller's external website.
 * For Growth plan sellers: records the click and charges $0.75 via Stripe
 * (charge hook is a TODO — logs a mock charge until Stripe is wired up).
 * For Enterprise: records the click, no charge.
 * For Free: should never be called (no link shown), returns 403.
 *
 * After recording, redirects to seller's website URL.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";

export async function GET(req: NextRequest) {
  const sellerId = req.nextUrl.searchParams.get("sellerId");
  if (!sellerId) {
    return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });
  }

  const supabase = await createClient();

  // ── Auth gate — must be a logged-in buyer (task #9) ──────────────────────
  // We still redirect the visitor to the seller's site (good UX), but we do
  // NOT record the click so unauthenticated bots/scrapers can't inflate stats.
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch seller profile + plan + website URL
  const { data: seller } = await supabase
    .from("seller_profiles")
    .select("plan, website, company_name")
    .eq("id", sellerId)
    .single();

  if (!seller?.website) {
    return NextResponse.json({ error: "Seller has no website" }, { status: 404 });
  }

  const plan = getPlan(seller.plan);

  if (plan.websiteLink === "hidden") {
    return NextResponse.json({ error: "Website links not available on this plan" }, { status: 403 });
  }

  // Ensure URL is absolute (needed for both authenticated and guest redirects)
  let url = seller.website as string;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Redirect unauthenticated visitors without recording a click
  if (!user) {
    return NextResponse.redirect(url, { status: 302 });
  }

  // Record the click (authenticated buyers only)
  await supabase.from("seller_website_clicks").insert({
    seller_id:   sellerId,
    plan_at_click: seller.plan ?? "free",
    cost_usd:    plan.websiteClickCostUsd,
    referrer:    req.headers.get("referer") ?? null,
  });

  // ── BILLING HOOK ──────────────────────────────────────────────────────────
  // TODO: when Stripe is live, charge the seller here:
  //   if (plan.websiteLink === "ppc" && seller.stripe_customer_id) {
  //     await stripe.charges.create({
  //       amount: Math.round(plan.websiteClickCostUsd * 100),
  //       currency: "usd",
  //       customer: seller.stripe_customer_id,
  //       description: `Website click-through — ${seller.company_name}`,
  //     });
  //   }
  if (plan.websiteLink === "ppc") {
    console.log(
      `[website-click] MOCK CHARGE $${plan.websiteClickCostUsd} to seller ${sellerId} (${seller.company_name})`
    );
  }

  return NextResponse.redirect(url, { status: 302 });
}
