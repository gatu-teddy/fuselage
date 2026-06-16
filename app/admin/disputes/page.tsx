import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DisputeQueue } from "@/components/admin/dispute-queue";

export default async function AdminDisputesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: open } = await supabase
    .from("disputes")
    .select("*, raiser:profiles!disputes_raised_by_fkey(full_name, email, country)")
    .in("status", ["open", "under_review"])
    .order("created_at", { ascending: true });

  const { data: closed } = await supabase
    .from("disputes")
    .select("*, raiser:profiles!disputes_raised_by_fkey(full_name, email)")
    .in("status", ["resolved", "closed"])
    .order("resolved_at", { ascending: false })
    .limit(30);

  return <DisputeQueue open={open ?? []} closed={closed ?? []} adminId={user.id} />;
}
