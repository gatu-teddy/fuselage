import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Building2 } from "lucide-react";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/browse");

  const { data: applications } = await supabase
    .from("seller_profiles")
    .select("*, profile:profiles(full_name, email, country)")
    .order("created_at", { ascending: false });

  const pending = applications?.filter((a) => a.status === "pending") ?? [];
  const reviewed = applications?.filter((a) => a.status !== "pending") ?? [];

  const statusVariant: Record<string, "warning" | "success" | "destructive" | "secondary"> = {
    pending: "warning",
    verified: "success",
    rejected: "destructive",
    suspended: "secondary",
  };

  type ApplicationRow = NonNullable<typeof applications>[number];
  function AppRow({ app }: { app: ApplicationRow }) {
    const p = app.profile as { full_name: string; email: string; country?: string };
    return (
      <Link href={`/admin/applications/${app.id}`}>
        <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{app.company_name}</div>
            <div className="text-xs text-muted-foreground">
              {p?.full_name} · {p?.email} · {app.city}{app.country ? `, ${app.country}` : ""}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              License: {app.trade_license_number} · Applied {formatDate(app.created_at)}
            </div>
          </div>
          <Badge variant={statusVariant[app.status] ?? "secondary"} className="capitalize shrink-0">
            {app.status}
          </Badge>
        </div>
      </Link>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Exporter applications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {pending.length} pending · {reviewed.length} reviewed
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Pending review ({pending.length})
          </h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {pending.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No pending applications.
                </p>
              )}
              {pending.map((app) => (
                <AppRow key={app.id} app={app} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Reviewed ({reviewed.length})
          </h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {reviewed.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No reviewed applications yet.
                </p>
              )}
              {reviewed.map((app) => (
                <AppRow key={app.id} app={app} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
