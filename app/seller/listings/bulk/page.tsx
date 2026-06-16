import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPlan } from "@/lib/plans";
import { BulkImportForm } from "@/components/seller/bulk-import-form";
import Link from "next/link";
import { Lock, Zap } from "lucide-react";

import { c } from "@/lib/tokens";

export default async function BulkImportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("seller_profiles")
    .select("plan, status")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/seller/onboarding");

  const plan = getPlan(profile.plan);

  // ── Gate: Growth+ only ───────────────────────────────────────────────────
  if (!plan.bulkImport) {
    return (
      <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-2xl">
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "48px 40px", textAlign: "center" }}>

          <div style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: c.amberBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Lock style={{ color: c.amber, width: "24px", height: "24px" }} />
          </div>

          <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "10px" }}>
            Bulk CSV import is a Growth feature
          </h1>
          <p style={{ color: c.muted, fontSize: "14px", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto 28px" }}>
            Your current plan (<strong>Free</strong>) supports manual listing creation only.
            Upgrade to <strong>Growth</strong> to import up to 50 vehicles at once via CSV.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px", textAlign: "left" }}>
            <div style={{ border: `1px solid ${c.border}`, borderRadius: "10px", padding: "16px" }}>
              <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Free (current)</p>
              {["Manual listing only", "10 listings max", "No bulk import", "All core features"].map(f => (
                <p key={f} style={{ color: c.muted, fontSize: "13px", marginBottom: "6px" }}>· {f}</p>
              ))}
            </div>
            <div style={{ border: `2px solid ${c.green}`, borderRadius: "10px", padding: "16px", backgroundColor: c.greenBg }}>
              <p style={{ color: c.greenText, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Growth ✦</p>
              {["Bulk CSV import", "50 listings", "Priority support", "Everything in Free"].map(f => (
                <p key={f} style={{ color: c.greenText, fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>✓ {f}</p>
              ))}
            </div>
          </div>

          <Link
            href="/pricing"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: c.primary, color: "#fff", fontSize: "14px", fontWeight: 700, padding: "12px 28px", borderRadius: "8px", textDecoration: "none" }}
          >
            <Zap style={{ width: "15px", height: "15px" }} /> View pricing plans
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

  return <BulkImportForm />;
}
