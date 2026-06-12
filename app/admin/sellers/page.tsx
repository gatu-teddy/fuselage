import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminSellersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/browse");

  const { data: sellers } = await supabase
    .from("seller_profiles")
    .select("*, profile:profiles(full_name, email)")
    .eq("status", "verified")
    .order("verified_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Verified exporters</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {sellers?.length ?? 0} active exporters on the platform
        </p>
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          {sellers?.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No verified exporters yet.
            </p>
          )}
          {sellers?.map((seller) => {
            const p = seller.profile as { full_name: string; email: string };
            return (
              <Link key={seller.id} href={`/admin/applications/${seller.id}`}>
                <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {seller.company_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{seller.company_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p?.full_name} · {p?.email} · {seller.city}{seller.country ? `, ${seller.country}` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      License: {seller.trade_license_number}
                      {seller.verified_at && ` · Verified ${formatDate(seller.verified_at)}`}
                    </div>
                  </div>
                  <Badge variant="success" className="shrink-0">Verified</Badge>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
