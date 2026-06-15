/**
 * GET /api/stripe/create-checkout?plan=growth|enterprise
 *
 * Creates a Stripe Checkout session and redirects the seller to the hosted
 * payment page.
 *
 * While STRIPE_SECRET_KEY / price IDs are not yet configured this route
 * redirects to /pricing?billing=soon so the rest of the app keeps working.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { STRIPE_ENABLED, getStripe } from "@/lib/stripe";

const PRICE_IDS: Record<string, string | undefined> = {
  growth:     process.env.STRIPE_GROWTH_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

function comingSoon(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = "/pricing";
  url.searchParams.set("billing", "soon");
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const planId = req.nextUrl.searchParams.get("plan");

  if (!planId || !["growth", "enterprise"].includes(planId)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // ── Stripe not configured yet ─────────────────────────────────────────────
  if (!STRIPE_ENABLED) {
    return comingSoon(req);
  }

  const priceId = PRICE_IDS[planId];
  if (!priceId) {
    return comingSoon(req);
  }

  // ── Stripe is live ────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/register";
    url.searchParams.set("role", "seller");
    url.searchParams.set("plan", planId);
    return NextResponse.redirect(url);
  }

  const stripe = getStripe();

  const [{ data: sellerProfile }, { data: profile }] = await Promise.all([
    supabase.from("seller_profiles").select("stripe_customer_id, company_name").eq("id", user.id).single(),
    supabase.from("profiles").select("email").eq("id", user.id).single(),
  ]);

  let customerId = (sellerProfile?.stripe_customer_id as string | null) ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email:    profile?.email ?? user.email,
      name:     sellerProfile?.company_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("seller_profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const origin  = req.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    customer:              customerId,
    mode:                  "subscription",
    line_items:            [{ price: priceId, quantity: 1 }],
    success_url:           `${origin}/seller/dashboard?upgraded=1`,
    cancel_url:            `${origin}/pricing`,
    allow_promotion_codes: true,
    metadata:              { supabase_user_id: user.id, plan: planId },
    subscription_data:     { metadata: { supabase_user_id: user.id, plan: planId } },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
