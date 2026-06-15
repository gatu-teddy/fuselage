import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SiteNav } from "@/components/layouts/site-nav";
import { SiteFooter } from "@/components/layouts/site-footer";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  // Middleware already verifies auth for /buyer/* and forwards x-user-id.
  // Reading the header avoids a redundant Supabase getUser() network call.
  const userId = (await headers()).get("x-user-id");
  if (!userId) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAFC" }}>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
