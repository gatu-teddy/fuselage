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
    .single();

  if (!application) notFound();

  return <ApplicationReviewPanel application={application} />;
}
