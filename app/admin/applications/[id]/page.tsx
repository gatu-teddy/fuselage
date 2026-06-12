import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ApplicationReviewPanel } from "@/components/admin/application-review-panel";

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/browse");

  const { data: application } = await supabase
    .from("seller_profiles")
    .select("*, profile:profiles(full_name, email, phone, country, created_at)")
    .eq("id", id)
    .single() as { data: {
      id: string; company_name: string; trade_license_number: string;
      trade_license_url?: string; document_urls?: string[];
      city: string; country?: string; website?: string; description?: string;
      status: string; rejection_reason?: string; verified_at?: string; created_at: string;
      profile: { full_name: string; email: string; phone?: string; country?: string; created_at: string };
    } | null };

  if (!application) notFound();

  return <ApplicationReviewPanel application={application} />;
}
