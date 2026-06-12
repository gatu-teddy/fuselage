import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPlan } from "@/lib/plans";
import Link from "next/link";
import { Check, Zap, BarChart2, Mail } from "lucide-react";

const c = {
  primary:   "#0F172A",
  green:     "#10B981",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  bg:        "#F8FAFC",
  bgDim:     "#F1F5F9",
  surface:   "#FFFFFF",
  border:    "#E2E8F0",
  muted:     "#64748B",
  body:      "#334155",
  purple:    "#7C3AED",
  purpleBg:  "#EDE9FE",
  purpleBorder: "#DDD6FE",
};

const PLANS = [
  {
    key: "free",
    label: "Free",
    price: "$0",
    period: "forever",
    color: c.muted,
    bg: c.bgDim,
    border: c.border,
    textColor: c.body,
    icon: null,
    features: [
      "Up to 10 listings",
      "Manual listing creation",
      "Inquiry management",
      "Buyer messaging",
      "Basic analytics",
      "Document verification",
    ],
    cta: null, // current plan highlight only
  },
  {
    key: "growth",
    label: "Growth",
    price: "$149",
    period: "per month",
    color: c.green,
    bg: c.greenBg,
    border: c.green,
    textColor: c.greenText,
    icon: Zap,
    features: [
      "Up to 50 listings",
      "Bulk CSV import",
      "All Free features",
      "Priority support",
      "Export analytics",
      "Featured badge (coming soon)",
    ],
    cta: "Upgrade to Growth",
  },
  {
    key: "enterprise",
    label: "Enterprise",
    price: "$399",
    period: "per month",
    color: c.purple,
    bg: c.purpleBg,
    border: c.purple,
    textColor: c.purple,
    icon: BarChart2,
    features: [
      "Unlimited listings",
      "Bulk CSV import",
      "All Growth features",
      "Dedicated account manager",
      "API access (coming soon)",
      "Custom destination ports",
    ],
    cta: "Upgrade to Enterprise",
  },
] as const;

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("seller_profiles")
    .select("plan, company_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/seller/onboarding");

  const currentPlan = getPlan(profile.plan);

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-10 text-center max-w-xl mx-auto">
        <h1 style={{ color: c.primary, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "10px" }}>
          Choose your plan
        </h1>
        <p style={{ color: c.muted, fontSize: "15px", lineHeight: 1.6 }}>
          Upgrade your Fuselage plan to unlock more listings, bulk tools, and priority support.
          Currently on <strong style={{ color: c.primary }}>{currentPlan.label}</strong>.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {PLANS.map((plan) => {
          const isCurrent = profile.plan === plan.key;
          const Icon = plan.icon;

          return (
            <div
              key={plan.key}
              style={{
                backgroundColor: c.surface,
                border: `2px solid ${isCurrent ? plan.border : c.border}`,
                borderRadius: "14px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Current badge */}
              {isCurrent && (
                <div style={{ position: "absolute", top: "14px", right: "14px", backgroundColor: plan.bg, color: plan.textColor, fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px", border: `1px solid ${plan.border}` }}>
                  CURRENT
                </div>
              )}

              <div style={{ padding: "24px 24px 20px" }}>
                {/* Plan name + icon */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  {Icon && <Icon style={{ color: plan.color, width: "16px", height: "16px" }} />}
                  <span style={{ color: plan.color, fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {plan.label}
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ color: c.primary, fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>{plan.price}</span>
                  <span style={{ color: c.muted, fontSize: "13px", marginLeft: "6px" }}>{plan.period}</span>
                </div>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Check style={{ color: plan.color, width: "14px", height: "14px", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ color: c.body, fontSize: "13px", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: c.bgDim, borderRadius: "8px", color: c.muted, fontSize: "13px", fontWeight: 600 }}>
                    Your current plan
                  </div>
                ) : plan.cta ? (
                  <a
                    href={`mailto:upgrade@fuselage.io?subject=${encodeURIComponent(`Upgrade request — ${plan.label} plan`)}&body=${encodeURIComponent(`Hi,\n\nI'd like to upgrade ${profile.company_name} to the ${plan.label} plan.\n\nAccount: ${user.email}\n\nPlease get in touch to complete the upgrade.\n\nThanks`)}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                      height: "42px", backgroundColor: plan.color, color: "#fff",
                      borderRadius: "8px", fontSize: "13px", fontWeight: 700,
                      textDecoration: "none", border: "none", cursor: "pointer",
                    }}
                  >
                    <Mail style={{ width: "14px", height: "14px" }} />
                    {plan.cta}
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact note */}
      <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.6 }}>
          Upgrades are processed manually within 1 business day. Email{" "}
          <a href="mailto:upgrade@fuselage.io" style={{ color: c.primary, fontWeight: 600, textDecoration: "none" }}>upgrade@fuselage.io</a>{" "}
          or click a plan above to pre-fill the request. We&apos;ll confirm and activate your plan immediately.
        </p>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link href="/seller/dashboard" style={{ color: c.muted, fontSize: "13px", textDecoration: "none" }}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
