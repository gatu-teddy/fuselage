import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BuyerNav } from "@/components/layouts/buyer-nav";
import { DealDetailView } from "@/components/deals/deal-detail-view";

export default async function BuyerDealPage({ params }: { params: Promise<{ id: string }> }) {
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
      seller:seller_profiles(*, profile:profiles(full_name, email)),
      messages:deal_messages(*, sender:profiles(full_name, avatar_url)),
      payment_proofs(*)
    `)
    .eq("id", id)
    .eq("buyer_id", user.id)
    .single();

  if (!deal) notFound();

  return (
    <div className="min-h-screen">
      <BuyerNav />
      <DealDetailView deal={deal} currentUserId={user.id} role="buyer" />
    </div>
  );
}
