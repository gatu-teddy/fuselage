import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { DealDetailView } from "@/components/deals/deal-detail-view";

export default async function BuyerDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Middleware already verified auth and set x-user-id (#14 — no extra getUser() call)
  const userId = (await headers()).get("x-user-id");
  if (!userId) redirect("/login");

  const supabase = await createClient();
  const { data: deal } = await supabase
    .from("deals")
    .select(`
      *,
      listing:listings(*, images:listing_images(url, is_primary)),
      buyer:profiles!deals_buyer_id_fkey(full_name, email, phone, avatar_url, country, kyc_status),
      seller:seller_profiles(id, company_name, city, country, status, plan, website, profile:profiles(full_name, email, avatar_url)),
      messages:deal_messages(*, sender:profiles(full_name, avatar_url)),
      payment_proofs(*),
      deal_documents(*)
    `)
    .eq("id", id)
    .eq("buyer_id", userId)
    .single();

  if (!deal) notFound();

  return <DealDetailView deal={deal} currentUserId={userId} role="buyer" />;
}
