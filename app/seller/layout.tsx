import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SellerNav } from "@/components/layouts/seller-nav";
import { SiteFooter } from "@/components/layouts/site-footer";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "seller") redirect("/");

  return (
    <div className="flex min-h-screen">
      <SellerNav />
      <div className="flex-1 flex flex-col overflow-auto" style={{ backgroundColor: "#F8FAFC" }}>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
