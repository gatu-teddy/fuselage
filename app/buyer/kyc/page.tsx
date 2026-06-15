import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { KycForm } from "@/components/buyer/kyc-form";
import type { KycStatus, KycDocType } from "@/lib/types/index";

export default async function BuyerKycPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("kyc_status, kyc_doc_type, kyc_submitted_at, kyc_verified_at, kyc_rejection_reason")
    .eq("id", user.id)
    .single();

  return (
    <KycForm
      userId={user.id}
      kycStatus={(profile?.kyc_status ?? "unverified") as KycStatus}
      kycDocType={(profile?.kyc_doc_type ?? null) as KycDocType | null}
      kycSubmittedAt={profile?.kyc_submitted_at ?? null}
      kycVerifiedAt={profile?.kyc_verified_at ?? null}
      kycRejectionReason={profile?.kyc_rejection_reason ?? null}
    />
  );
}
