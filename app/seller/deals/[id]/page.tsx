import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { DealDetailView } from "@/components/deals/deal-detail-view";

const c = {
  primary: "#0F172A",
  green:   "#10B981",
  bg:      "#FFFFFF",
  border:  "#E2E8F0",
  muted:   "#64748B",
};

function StitchNav({ active }: { active?: string }) {
  const links = [
    { href: "/",             label: "Home" },
    { href: "/browse",       label: "Browse" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/seller/deals", label: "My Deals" },
  ];
  return (
    <nav
      style={{
        backgroundColor: c.bg,
        borderBottom: `1px solid ${c.border}`,
        fontFamily: "Inter, sans-serif",
        position: "sticky", top: 0, zIndex: 50,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
        <Link href="/" style={{ color: c.primary, fontWeight: 800, fontSize: "18px", textDecoration: "none", letterSpacing: "-0.5px" }}>
          Fuselage
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                color: active === label ? c.primary : c.muted,
                fontWeight: active === label ? 700 : 500,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link
          href="/sell"
          style={{
            backgroundColor: c.primary, color: "#fff",
            fontSize: "13px", fontWeight: 600,
            padding: "8px 18px", borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          List a Vehicle
        </Link>
      </div>
    </nav>
  );
}

export default async function SellerDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: deal } = await supabase
    .from("deals")
    .select(`
      *,
      listing:listings(*, images:listing_images(url, is_primary)),
      buyer:profiles(*),
      seller:seller_profiles(*, profile:profiles(*)),
      messages:deal_messages(*, sender:profiles(full_name, avatar_url)),
      payment_proofs(*)
    `)
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (!deal) notFound();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      <StitchNav active="My Deals" />
      <DealDetailView deal={deal} currentUserId={user.id} role="seller" />
    </div>
  );
}
