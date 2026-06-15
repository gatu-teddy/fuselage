import Link from "next/link";
import { PLANS, type Plan } from "@/lib/plans";
import { Check, Minus, Zap, Shield, Truck } from "lucide-react";
import { c } from "@/lib/tokens";

// ─── Feature row definitions ──────────────────────────────────────────────────
type FeatureValue = boolean | string | number;

interface FeatureRow {
  label:      string;
  hint?:      string;
  free:       FeatureValue;
  growth:     FeatureValue;
  enterprise: FeatureValue;
  highlight?: boolean;
}

const FEATURES: FeatureRow[] = [
  {
    label:      "Active listings",
    hint:       "Maximum vehicles listed at once",
    free:       "25",
    growth:     "65",
    enterprise: "Unlimited",
    highlight:  true,
  },
  {
    label:  "Photos per listing",
    free:       "5",
    growth:     "10",
    enterprise: "10",
  },
  {
    label:      "Videos per listing",
    hint:       "Coming soon",
    free:       false,
    growth:     false,
    enterprise: "2 (coming soon)",
  },
  {
    label:      "Destination ports",
    hint:       "Countries / ports you can ship to",
    free:       "Proof of prior shipment required",
    growth:     "Proof of prior shipment required",
    enterprise: "Unrestricted",
    highlight:  true,
  },
  {
    label:  "Bulk CSV import",
    hint:   "Upload your entire inventory at once",
    free:       false,
    growth:     true,
    enterprise: true,
  },
  {
    label:  "Analytics dashboard",
    hint:   "Views, inquiries, and conversion data",
    free:       false,
    growth:     true,
    enterprise: true,
  },
  {
    label:      "Featured boosts",
    hint:       "Pin listings to the top of search results",
    free:       false,
    growth:     "2 / month",
    enterprise: "5 / month",
  },
  {
    label:  "Priority in search",
    hint:   "Your listings appear above same-tier competitors",
    free:       false,
    growth:     false,
    enterprise: true,
  },
  {
    label:  "Support",
    free:       "Email",
    growth:     "Email",
    enterprise: "Dedicated manager",
  },
  {
    label:  "Verification queue",
    free:       "Standard",
    growth:     "Standard",
    enterprise: "Priority",
  },
];

// ─── Value cell renderer ───────────────────────────────────────────────────────
function Cell({ value, planId }: { value: FeatureValue; planId: "free" | "growth" | "enterprise" }) {
  if (value === true) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check style={{ width: "11px", height: "11px", color: c.green, strokeWidth: 3 }} />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Minus style={{ width: "14px", height: "14px", color: "#CBD5E1" }} />
      </div>
    );
  }
  // String / number
  const textColor =
    planId === "enterprise" ? c.purple :
    planId === "growth"     ? c.blue   : c.body;

  return (
    <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 600, color: textColor, lineHeight: 1.4 }}>
      {String(value)}
    </p>
  );
}

// ─── Plan card (mobile / hero section) ───────────────────────────────────────
function PlanCard({ plan, popular }: { plan: Plan; popular?: boolean }) {
  const isFree       = plan.id === "free";
  const isEnterprise = plan.id === "enterprise";

  const accentColor  = isEnterprise ? c.purple : plan.id === "growth" ? c.blue : c.muted;
  const accentBg     = isEnterprise ? c.purpleBg : plan.id === "growth" ? c.blueBg : c.bgDim;
  const accentBorder = isEnterprise ? c.purpleBorder : plan.id === "growth" ? c.blueBorder : c.border;

  return (
    <div
      style={{
        backgroundColor:  c.surface,
        border:           `2px solid ${popular ? c.primary : c.border}`,
        borderRadius:     "14px",
        overflow:         "hidden",
        position:         "relative",
        flex:             1,
        minWidth:         0,
        boxShadow:        popular ? "0 8px 32px rgba(15,23,42,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Popular badge */}
      {popular && (
        <div style={{ backgroundColor: c.primary, textAlign: "center", padding: "6px 0" }}>
          <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Most Popular
          </span>
        </div>
      )}

      <div style={{ padding: "28px 24px 24px" }}>
        {/* Plan label */}
        <span
          style={{
            display: "inline-block",
            backgroundColor: accentBg, color: accentColor, border: `1px solid ${accentBorder}`,
            fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px",
            letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "14px",
          }}
        >
          {plan.label}
        </span>

        {/* Price */}
        <div style={{ marginBottom: "8px" }}>
          {isFree ? (
            <p style={{ color: c.primary, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px" }}>Free</p>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
              <p style={{ color: c.primary, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>
                ${plan.price}
              </p>
              <span style={{ color: c.muted, fontSize: "13px", fontWeight: 500, paddingBottom: "4px" }}>/month</span>
            </div>
          )}
        </div>

        <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.6, marginBottom: "24px" }}>
          {plan.description}
        </p>

        {/* CTA */}
        <Link
          href={isFree ? "/register?role=seller" : `/api/stripe/create-checkout?plan=${plan.id}`}
          style={{
            display:         "block",
            textAlign:       "center",
            backgroundColor: popular ? c.primary : isEnterprise ? c.purple : "transparent",
            color:           popular || isEnterprise ? "#fff" : c.primary,
            border:          `2px solid ${popular ? c.primary : isEnterprise ? c.purple : c.border}`,
            fontSize:        "14px",
            fontWeight:      700,
            padding:         "11px 0",
            borderRadius:    "8px",
            textDecoration:  "none",
            transition:      "opacity 0.15s",
          }}
          className="hover:opacity-90"
        >
          {isFree ? "Get started free" : `Start ${plan.label}`}
        </Link>

        {!isFree && (
          <p style={{ textAlign: "center", color: c.muted, fontSize: "11px", marginTop: "8px" }}>
            No contracts · cancel anytime
          </p>
        )}

        {/* Key highlights */}
        <div style={{ borderTop: `1px solid ${c.border}`, marginTop: "24px", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            plan.listingLimit === Infinity
              ? "Unlimited active listings"
              : `${plan.listingLimit} active listings`,
            `${plan.imageLimit} photos per listing`,
            plan.bulkImport ? "Bulk CSV import" : null,
            plan.analytics  ? "Analytics dashboard" : null,
            plan.featuredBoosts > 0 ? `${plan.featuredBoosts} featured boost${plan.featuredBoosts > 1 ? "s" : ""} / month` : null,
            plan.prioritySearch ? "Priority in search results" : null,
            plan.portPolicy === "unrestricted_with_liability" ? "Unrestricted destination ports" : "Proof of shipment for ports",
            `${plan.support} support`,
          ].filter(Boolean).map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                <Check style={{ width: "9px", height: "9px", color: c.green, strokeWidth: 3 }} />
              </div>
              <span style={{ color: c.body, fontSize: "13px", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const plans = [PLANS.free, PLANS.growth, PLANS.enterprise];

  return (
    <>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ display: "inline-block", backgroundColor: c.greenBg, color: c.greenText, fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "99px", marginBottom: "20px", letterSpacing: "0.05em" }}>
            SELLER PLANS
          </span>
          <h1 style={{ color: c.primary, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "18px" }}>
            Grow your export business
          </h1>
          <p style={{ color: c.muted, fontSize: "18px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 32px" }}>
            Start free. One deal pays for a year of Growth. Buyers always browse for free.
          </p>

          {/* Trust bar */}
          <div className="flex items-center justify-center flex-wrap gap-6">
            {[
              { icon: Shield, text: "No contracts" },
              { icon: Zap,    text: "Cancel anytime" },
              { icon: Truck,  text: "Buyers browse free" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "7px", color: c.muted, fontSize: "13px", fontWeight: 500 }}>
                <Icon style={{ width: "14px", height: "14px", color: c.green }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Plan cards ───────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-5 mb-20" style={{ alignItems: "stretch" }}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} popular={plan.id === "growth"} />
          ))}
        </div>

        {/* ── Feature comparison table ──────────────────────────────────────── */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", overflow: "hidden", marginBottom: "60px" }}>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: `2px solid ${c.border}` }}>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ color: c.primary, fontSize: "13px", fontWeight: 700 }}>All features</p>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} style={{ padding: "20px 12px", textAlign: "center", borderLeft: `1px solid ${c.border}`, backgroundColor: plan.id === "growth" ? "#FAFBFF" : "transparent" }}>
                <p style={{ color: plan.textColor, fontSize: "13px", fontWeight: 800, letterSpacing: "0.02em" }}>{plan.label}</p>
                {plan.price > 0 && (
                  <p style={{ color: c.muted, fontSize: "11px", marginTop: "2px" }}>${plan.price}/mo</p>
                )}
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {FEATURES.map((row, i) => (
            <div
              key={row.label}
              style={{
                display:         "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                borderBottom:    i < FEATURES.length - 1 ? `1px solid ${c.border}` : "none",
                backgroundColor: row.highlight ? "#FAFCFF" : "transparent",
              }}
            >
              {/* Label */}
              <div style={{ padding: "16px 24px" }}>
                <p style={{ color: c.body, fontSize: "13px", fontWeight: 500 }}>{row.label}</p>
                {row.hint && (
                  <p style={{ color: c.muted, fontSize: "11px", marginTop: "2px" }}>{row.hint}</p>
                )}
              </div>
              {/* Values */}
              {(["free", "growth", "enterprise"] as const).map((pid) => (
                <div
                  key={pid}
                  style={{
                    padding:         "16px 12px",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    borderLeft:      `1px solid ${c.border}`,
                    backgroundColor: pid === "growth" ? "#FAFBFF" : "transparent",
                  }}
                >
                  <Cell value={row[pid]} planId={pid} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Destination ports explainer ───────────────────────────────────── */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "32px", marginBottom: "60px" }}>
          <div className="flex items-start gap-4">
            <div style={{ backgroundColor: c.amberBg, width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Truck style={{ color: c.amber, width: "18px", height: "18px" }} />
            </div>
            <div>
              <h3 style={{ color: c.primary, fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>How destination ports work</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <p style={{ color: c.body, fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Free &amp; Growth</p>
                  <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.7 }}>
                    You can list any destination port but it stays <strong style={{ color: c.amber }}>pending</strong> until you upload proof of a prior shipment to that country (e.g. a Bill of Lading). Listings that include a pending port are not shown to buyers until the port is approved by our team.
                  </p>
                </div>
                <div>
                  <p style={{ color: c.body, fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Enterprise</p>
                  <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.7 }}>
                    You can ship to any destination without prior shipment proof. Each new port you add requires accepting a <strong style={{ color: c.purple }}>liability acknowledgement</strong> — confirming you take full responsibility for delivery, handling, and any failed or delayed shipments to that destination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "32px", textAlign: "center" }}>
            Common questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Do buyers pay anything?",
                a: "No. Buyers browse, inquire, and manage deals entirely for free. Only sellers pay.",
              },
              {
                q: "Can I downgrade my plan?",
                a: "Yes. If you downgrade and your active listing count exceeds the new plan's limit, excess listings are moved to draft automatically.",
              },
              {
                q: "What counts as a 'prior shipment'?",
                a: "Any official shipping document — Bill of Lading, freight receipt, or customs clearance — showing a completed export to that destination.",
              },
              {
                q: "What does the liability acceptance cover?",
                a: "Enterprise sellers accept full responsibility for delivery and handling to any destination they add without prior shipment proof. TrueWagon is an introduction platform and does not handle goods.",
              },
              {
                q: "When will video uploads be available?",
                a: "Videos are on the roadmap for Enterprise sellers. The slot is reserved on your listing — we'll enable it in a future update.",
              },
              {
                q: "Can I switch plans at any time?",
                a: "Yes. Upgrades apply immediately. Downgrades take effect at the end of the billing period.",
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px 22px" }}>
                <p style={{ color: c.primary, fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>{q}</p>
                <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        <div style={{ backgroundColor: c.primary, borderRadius: "16px", padding: "48px 40px", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "12px" }}>
            Ready to reach international buyers?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", marginBottom: "28px" }}>
            Register in minutes. No card required to start.
          </p>
          <Link
            href="/register?role=seller"
            style={{ display: "inline-block", backgroundColor: c.green, color: "#fff", fontSize: "15px", fontWeight: 700, padding: "14px 36px", borderRadius: "9px", textDecoration: "none" }}
            className="hover:opacity-90 transition-opacity"
          >
            Start for free →
          </Link>
        </div>
      </div>
    </>
  );
}
