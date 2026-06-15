/**
 * GET /api/stripe/create-checkout?plan=growth|enterprise
 *
 * Creates a Stripe Checkout session for the requested plan and redirects the
 * user directly to the hosted payment page.
 *
 * Unauthenticated visitors are bounced to /register (plan pre-selected).
 * If STRIPE_*_PRICE_ID env vars are not yet set the route falls back to the
 * same /register redirect so the page stays functional during development.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

const PRICE_IDS: Record<string, string | undefined> = {
  growth:     process.env.STRIPE_GROWTH_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

function fallbackToRegister(req: NextRequest, planId: string): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = "/register";
  url.searchParams.set("role", "seller");
  url.searchParams.set("plan", planId);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const planId = req.nextUrl.searchParams.get("plan");

  if (!planId || !["growth", "enterprise"].includes(planId)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = PRICE_IDS[planId];

  // Stripe not configured yet → gracefully fall back to register flow
  if (!priceId) {
    return fallbackToRegister(req, planId);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → register first, Stripe session created after onboarding
  if (!user) {
    return fallbackToRegister(req, planId);
  }

  // Fetch or create a Stripe customer for this seller
  const [{ data: sellerProfile }, { data: profile }] = await Promise.all([
    supabase.from("seller_profiles").select("stripe_customer_id, company_name").eq("id", user.id).single(),
    supabase.from("profiles").select("email").eq("id", user.id).single(),
  ]);

  let customerId = sellerProfile?.stripe_customer_id as string | null ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email,
      name:  sellerProfile?.company_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    // Persist customer ID so future upgrades/downgrades reuse the same customer
    await supabase
      .from("seller_profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    customer:         customerId,
    mode:             "subscription",
    line_items:       [{ price: priceId, quantity: 1 }],
    success_url:      `${origin}/seller/dashboard?upgraded=1`,
    cancel_url:       `${origin}/pricing`,
    allow_promotion_codes: true,
    metadata: { supabase_user_id: user.id, plan: planId },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan: planId },
    },
  });

  // 303 so the browser doesn't re-POST on back-button
  return NextResponse.redirect(session.url!, { status: 303 });
}
