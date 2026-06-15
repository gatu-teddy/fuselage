/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe webhook events and syncs subscription state to Supabase.
 *
 * Events handled:
 *   checkout.session.completed      — mark plan as active after first payment
 *   customer.subscription.updated   — plan change / renewal / status update
 *   customer.subscription.deleted   — cancellation → downgrade to free
 *   invoice.payment_failed          — mark subscription as past_due
 *
 * Setup:
 *   1. Add STRIPE_WEBHOOK_SECRET from the Stripe dashboard (or `stripe listen`)
 *   2. Register this URL in Stripe → Webhooks → Add endpoint
 *   3. Select the four events above
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { STRIPE_ENABLED, getStripe } from "@/lib/stripe";
import Stripe from "stripe";

// Use the service role key so RLS is bypassed for trusted webhook writes.
// Never expose this key to the client.
function getServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** Updates seller_profiles with current subscription state. */
async function syncSellerPlan(
  userId: string,
  plan: string,
  subscriptionId: string,
  customerId: string,
  subscriptionStatus: string,
) {
  const supabase = getServiceClient();
  const effectivePlan =
    subscriptionStatus === "active" || subscriptionStatus === "trialing"
      ? plan
      : "free";

  await supabase
    .from("seller_profiles")
    .update({
      plan:                   effectivePlan,
      stripe_customer_id:     customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status:    subscriptionStatus,
    })
    .eq("id", userId);
}

export async function POST(req: NextRequest) {
  // Stripe not configured yet — acknowledge silently so the endpoint doesn't 500
  if (!STRIPE_ENABLED) {
    return NextResponse.json({ received: true, note: "Stripe not configured" });
  }

  const body   = await req.text();
  const sig    = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId        = session.metadata?.supabase_user_id;
        const plan          = session.metadata?.plan;
        const subscriptionId = session.subscription as string;
        const customerId    = session.customer as string;

        if (userId && plan && subscriptionId) {
          await syncSellerPlan(userId, plan, subscriptionId, customerId, "active");
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        const plan   = sub.metadata?.plan;

        if (userId && plan) {
          await syncSellerPlan(userId, plan, sub.id, sub.customer as string, sub.status);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;

        if (userId) {
          // Cancelled → revert to free plan
          await syncSellerPlan(userId, "free", sub.id, sub.customer as string, "canceled");
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId   = invoice.subscription as string | null;

        if (subId) {
          const sub    = await getStripe().subscriptions.retrieve(subId);
          const userId = sub.metadata?.supabase_user_id;

          if (userId) {
            const supabase = getServiceClient();
            await supabase
              .from("seller_profiles")
              .update({ subscription_status: "past_due" })
              .eq("id", userId);
          }
        }
        break;
      }

      default:
        // Acknowledge but do not act on unhandled event types
        break;
    }
  } catch (err) {
    console.error(`[stripe-webhook] Handler error for ${event.type}:`, err);
    // Return 500 so Stripe will retry the event
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
