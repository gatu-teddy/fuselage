import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/layouts/site-nav";
import { SiteFooter } from "@/components/layouts/site-footer";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAFC" }}>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
