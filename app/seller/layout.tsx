import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SellerNav } from "@/components/layouts/seller-nav";
import { SiteFooter } from "@/components/layouts/site-footer";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  // Middleware already verifies auth + seller role + verified status for
  // /seller/* routes and forwards x-user-id.  No extra DB call needed here.
  const userId = (await headers()).get("x-user-id");
  if (!userId) redirect("/login");

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
