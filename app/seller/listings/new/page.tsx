import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPlan } from "@/lib/plans";
import { NewListingForm } from "@/components/seller/new-listing-form";
import Link from "next/link";
import { Lock, Zap, BarChart2 } from "lucide-react";

import { c } from "@/lib/tokens";

export default async function NewListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count: listingCount }] = await Promise.all([
    supabase.from("seller_profiles").select("plan, status").eq("id", user.id).single(),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
  ]);

  if (!profile) redirect("/seller/onboarding");

  const plan = getPlan(profile.plan);
  const used = listingCount ?? 0;
  const atLimit = plan.listingLimit !== Infinity && used >= plan.listingLimit;

  // ── Gate: listing limit reached ──────────────────────────────────────────
  if (atLimit) {
    const nextPlan = profile.plan === "free" ? "growth" : "enterprise";
    const nextLimit = nextPlan === "growth" ? 50 : "Unlimited";

    return (
      <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-2xl">
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "48px 40px", textAlign: "center" }}>

          <div style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: c.amberBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Lock style={{ color: c.amber, width: "24px", height: "24px" }} />
          </div>

          <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "10px" }}>
            Listing limit reached
          </h1>
          <p style={{ color: c.muted, fontSize: "14px", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 24px" }}>
            You&apos;ve used <strong>{used}</strong> of <strong>{plan.listingLimit}</strong> listings on your{" "}
            <strong>{plan.label}</strong> plan. Upgrade to add more vehicles to your inventory.
          </p>

          {/* Usage bar */}
          <div style={{ backgroundColor: "#F1F5F9", borderRadius: "99px", height: "8px", margin: "0 auto 24px", maxWidth: "320px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min((used / plan.listingLimit) * 100, 100)}%`, backgroundColor: c.amber, borderRadius: "99px" }} />
          </div>

          {/* Plan options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px", textAlign: "left" }}>
            <div style={{ border: `2px solid ${c.green}`, borderRadius: "10px", padding: "16px", backgroundColor: c.greenBg }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <Zap style={{ color: c.greenText, width: "13px", height: "13px" }} />
                <p style={{ color: c.greenText, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Growth</p>
              </div>
              {["50 listings", "Bulk CSV import", "Priority support"].map(f => (
                <p key={f} style={{ color: c.greenText, fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>✓ {f}</p>
              ))}
            </div>
            <div style={{ border: `2px solid ${c.purple}`, borderRadius: "10px", padding: "16px", backgroundColor: c.purpleBg }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <BarChart2 style={{ color: c.purple, width: "13px", height: "13px" }} />
                <p style={{ color: c.purple, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Enterprise</p>
              </div>
              {["Unlimited listings", "Bulk CSV import", "Dedicated support"].map(f => (
                <p key={f} style={{ color: c.purple, fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>✓ {f}</p>
              ))}
            </div>
          </div>

          <Link
            href="/seller/upgrade"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: c.primary, color: "#fff", fontSize: "14px", fontWeight: 700, padding: "12px 28px", borderRadius: "8px", textDecoration: "none" }}
          >
            <Zap style={{ width: "15px", height: "15px" }} /> View upgrade options
          </Link>

          <div style={{ marginTop: "16px" }}>
            <Link href="/seller/listings" style={{ color: c.muted, fontSize: "13px", textDecoration: "none" }}>
              ← Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <NewListingForm />;
}
