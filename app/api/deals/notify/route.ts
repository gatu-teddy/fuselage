/**
 * POST /api/deals/notify
 *
 * Mock email notification layer.
 * When a real email provider (Resend, SendGrid, Postmark, etc.) is wired up,
 * replace the console.log blocks with actual send calls.
 *
 * Events:
 *   payment_uploaded       → notify seller: please verify receipt
 *   payment_confirmed      → notify buyer:  payment confirmed, shipping in progress
 *   deal_agreed            → notify buyer:  terms agreed, please wire payment
 *   shipped                → notify buyer:  vehicle has shipped (tracking number)
 *   delivered              → notify seller: buyer acknowledges delivery
 *   document_uploaded      → notify other party: new document added
 *   counter_sign_requested → notify other party: signature required
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifyEvent =
  | "payment_uploaded"
  | "payment_confirmed"
  | "deal_agreed"
  | "shipped"
  | "delivered"
  | "document_uploaded"
  | "counter_sign_requested";

interface NotifyPayload {
  dealId: string;
  event: NotifyEvent;
  /** Extra data to include in the email body (optional) */
  meta?: Record<string, string | number | null>;
}

// ─── Email templates (mock — swap for real HTML later) ───────────────────────
function buildEmail(
  event: NotifyEvent,
  deal: {
    id: string;
    listing?: { make?: string; model?: string; year?: number };
    buyer?: { full_name?: string; email?: string };
    seller?: { company_name?: string; profile?: { email?: string } };
  },
  meta?: Record<string, string | number | null>,
) {
  const vehicleName =
    deal.listing
      ? `${deal.listing.year ?? ""} ${deal.listing.make ?? ""} ${deal.listing.model ?? ""}`.trim()
      : "your vehicle";

  const dealUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://truewagon.com"}/seller/deals/${deal.id}`;
  const buyerDealUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://truewagon.com"}/buyer/deals/${deal.id}`;

  const templates: Record<
    NotifyEvent,
    { to: string; subject: string; body: string }
  > = {
    payment_uploaded: {
      to: deal.seller?.profile?.email ?? "",
      subject: `[Action Required] Payment received for ${vehicleName} — please verify`,
      body: `
Hi ${deal.seller?.company_name ?? "there"},

${deal.buyer?.full_name ?? "The buyer"} has uploaded proof of payment for the ${vehicleName}.

Your action is required:
→ Review the payment proof
→ Confirm receipt (or raise a query if the amount is incorrect)

IMPORTANT: By confirming receipt you are acknowledging that payment has been received
and that you are actively in a binding transaction with the buyer.

Review and confirm here:
${dealUrl}

——
TrueWagon · This is an automated message. Do not reply to this email.
      `.trim(),
    },

    payment_confirmed: {
      to: deal.buyer?.email ?? "",
      subject: `Payment confirmed — ${vehicleName} is being prepared for export`,
      body: `
Hi ${deal.buyer?.full_name ?? "there"},

Great news — ${deal.seller?.company_name ?? "the exporter"} has confirmed receipt of your payment for the ${vehicleName}.

What happens next:
1. The exporter will arrange shipping and upload the Bill of Lading
2. You'll receive another notification when the vehicle ships
3. Track your deal at any time from your dashboard

View your deal:
${buyerDealUrl}

——
TrueWagon · This is an automated message. Do not reply to this email.
      `.trim(),
    },

    deal_agreed: {
      to: deal.buyer?.email ?? "",
      subject: `Terms agreed — next step: wire payment for ${vehicleName}`,
      body: `
Hi ${deal.buyer?.full_name ?? "there"},

${deal.seller?.company_name ?? "The exporter"} has marked your deal as agreed for the ${vehicleName}${meta?.agreed_price_usd ? ` at $${meta.agreed_price_usd.toLocaleString()}` : ""}.

Next step:
→ Wire the agreed amount to the exporter's account
→ Upload your proof of payment through your deal dashboard
→ The exporter will confirm receipt and begin the export process

Upload payment proof:
${buyerDealUrl}

——
TrueWagon · This is an automated message. Do not reply to this email.
      `.trim(),
    },

    shipped: {
      to: deal.buyer?.email ?? "",
      subject: `Your ${vehicleName} has shipped 🚢`,
      body: `
Hi ${deal.buyer?.full_name ?? "there"},

Your ${vehicleName} is on its way!

${meta?.tracking_number ? `Bill of Lading / Tracking: ${meta.tracking_number}` : ""}
Destination: ${meta?.destination_country ?? ""}

Track your shipment and view documents:
${buyerDealUrl}

——
TrueWagon · This is an automated message. Do not reply to this email.
      `.trim(),
    },

    delivered: {
      to: deal.seller?.profile?.email ?? "",
      subject: `Delivery confirmed — ${vehicleName}`,
      body: `
Hi ${deal.seller?.company_name ?? "there"},

The buyer has confirmed delivery of the ${vehicleName}. Please mark the deal as completed once all final checks are done.

Complete the deal:
${dealUrl}

——
TrueWagon · This is an automated message. Do not reply to this email.
      `.trim(),
    },

    document_uploaded: {
      to: "", // caller passes the recipient in meta.recipientEmail
      subject: `New document added to your deal — ${vehicleName}`,
      body: `
A new document (${meta?.docLabel ?? "document"}) has been added to the deal for ${vehicleName}.

Review it here:
${meta?.role === "seller" ? dealUrl : buyerDealUrl}

——
TrueWagon · This is an automated message. Do not reply to this email.
      `.trim(),
    },

    counter_sign_requested: {
      to: "", // caller passes recipient in meta.recipientEmail
      subject: `[Signature Required] ${meta?.docLabel ?? "Document"} — ${vehicleName}`,
      body: `
Your signature is required on the ${meta?.docLabel ?? "document"} for the ${vehicleName} deal.

Please review and upload your signed copy:
${meta?.role === "seller" ? dealUrl : buyerDealUrl}

——
TrueWagon · This is an automated message. Do not reply to this email.
      `.trim(),
    },
  };

  const tpl = templates[event];

  // Override recipient if caller provided one
  if (meta?.recipientEmail) {
    tpl.to = meta.recipientEmail as string;
  }

  return tpl;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Must be authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as NotifyPayload;
    const { dealId, event, meta } = body;

    if (!dealId || !event) {
      return NextResponse.json({ error: "Missing dealId or event" }, { status: 400 });
    }

    // Fetch deal context for template rendering
    const { data: deal } = await supabase
      .from("deals")
      .select(`
        id,
        destination_country,
        tracking_number,
        agreed_price_usd,
        listing:listings(make, model, year),
        buyer:profiles(full_name, email),
        seller:seller_profiles(company_name, profile:profiles(email))
      `)
      .eq("id", dealId)
      .single();

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const email = buildEmail(event, deal as Parameters<typeof buildEmail>[1], meta);

    // ── MOCK: log instead of sending ────────────────────────────────────────
    // TODO: replace this block with your email provider call, e.g.:
    //   await resend.emails.send({ from: "noreply@truewagon.com", ...email });
    console.log("\n────────────────────────────────────────");
    console.log("📧  MOCK EMAIL (not sent — no provider configured yet)");
    console.log(`To:      ${email.to}`);
    console.log(`Subject: ${email.subject}`);
    console.log(`Body:\n${email.body}`);
    console.log("────────────────────────────────────────\n");

    return NextResponse.json({
      ok: true,
      mock: true,
      preview: email,
    });
  } catch (err) {
    console.error("[/api/deals/notify] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
