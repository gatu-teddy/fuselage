import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { KycReviewQueue } from "@/components/admin/kyc-review-queue";

export default async function AdminKycPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all submissions grouped by status
  const { data: pending } = await supabase
    .from("profiles")
    .select("id, full_name, email, country, kyc_status, kyc_doc_type, kyc_doc_url, kyc_submitted_at")
    .eq("kyc_status", "pending")
    .order("kyc_submitted_at", { ascending: true });

  const { data: recent } = await supabase
    .from("profiles")
    .select("id, full_name, email, country, kyc_status, kyc_doc_type, kyc_verified_at, kyc_rejection_reason")
    .in("kyc_status", ["verified", "rejected"])
    .order("kyc_verified_at", { ascending: false })
    .limit(20);

  return (
    <KycReviewQueue
      pending={pending ?? []}
      recent={recent ?? []}
    />
  );
}
