import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, ClipboardList, Shield } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/browse");

  const [
    { count: totalBuyers },
    { count: totalSellers },
    { count: pendingApps },
    { count: activeListings },
    { count: activeDeals },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "buyer"),
    supabase.from("seller_profiles").select("*", { count: "exact", head: true }).eq("status", "verified"),
    supabase.from("seller_profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("deals").select("*", { count: "exact", head: true }).not("status", "in", '("completed","cancelled")'),
  ]);

  const stats = [
    { label: "Registered buyers", value: totalBuyers ?? 0, icon: Users },
    { label: "Verified exporters", value: totalSellers ?? 0, icon: Shield },
    { label: "Pending applications", value: pendingApps ?? 0, icon: Shield, highlight: true },
    { label: "Active listings", value: activeListings ?? 0, icon: Car },
    { label: "Active deals", value: activeDeals ?? 0, icon: ClipboardList },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Platform overview</h1>
        <p className="text-muted-foreground text-sm mt-1">TrueWagon admin dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, highlight }) => (
          <Card key={label} className={highlight && value > 0 ? "border-yellow-300 bg-yellow-50" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${highlight && value > 0 ? "text-yellow-700" : ""}`}>
                {value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
