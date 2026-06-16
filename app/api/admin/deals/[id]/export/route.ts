/**
 * GET /api/admin/deals/[id]/export
 *
 * Admin-only. Returns a JSON manifest of signed URLs for every document
 * attached to a deal — deal_documents, payment_proofs, and bill_of_lading.
 * URLs are valid for 1 hour.
 *
 * Response shape:
 *   { deal_id, generated_at, files: [{ label, bucket, path, signed_url }] }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Auth — must be admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch deal + all attached files
  const { data: deal } = await supabase
    .from("deals")
    .select("id, buyer_id, seller_id, bill_of_lading_url, deal_documents(*), payment_proofs(*)")
    .eq("id", id)
    .single();

  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  const svc   = serviceClient();
  const files: { label: string; bucket: string; path: string; signed_url: string | null }[] = [];
  const TTL   = 3600;

  async function sign(bucket: string, path: string | null | undefined, label: string) {
    if (!path) return;
    const { data } = await svc.storage.from(bucket).createSignedUrl(path, TTL);
    files.push({ label, bucket, path, signed_url: data?.signedUrl ?? null });
  }

  // Deal documents
  const docs = deal.deal_documents as { doc_type: string; doc_label?: string; file_url: string; file_name: string; counter_sign_file_url?: string }[];
  for (const doc of docs ?? []) {
    const label = doc.doc_label ?? doc.doc_type;
    await sign("deal-documents", doc.file_url, label);
    if (doc.counter_sign_file_url) {
      await sign("deal-documents", doc.counter_sign_file_url, `${label} (counter-signed)`);
    }
  }

  // Payment proofs
  const proofs = deal.payment_proofs as { file_url: string; file_name?: string; amount_usd?: number }[];
  for (const [i, proof] of (proofs ?? []).entries()) {
    await sign("payment-proofs", proof.file_url, `Payment proof ${i + 1}${proof.amount_usd ? ` ($${proof.amount_usd})` : ""}`);
  }

  // Bill of lading
  if (deal.bill_of_lading_url) {
    await sign("deal-documents", deal.bill_of_lading_url, "Bill of Lading");
  }

  return NextResponse.json({
    deal_id:      id,
    generated_at: new Date().toISOString(),
    file_count:   files.length,
    expires_in:   "1 hour",
    files,
  });
}
