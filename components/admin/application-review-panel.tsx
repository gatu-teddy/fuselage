"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle, XCircle, Building2, Globe, Hash, User, Mail, Phone,
  FileText, Download, ExternalLink, ImageIcon, MapPin,
} from "lucide-react";

interface Props {
  application: {
    id: string;
    company_name: string;
    trade_license_number: string;
    trade_license_url?: string;
    document_urls?: string[];
    city: string;
    country?: string;
    website?: string;
    description?: string;
    status: string;
    rejection_reason?: string;
    verified_at?: string;
    created_at: string;
    profile: {
      full_name: string;
      email: string;
      phone?: string;
      country?: string;
      created_at: string;
    };
  };
}

function isPdf(url: string) {
  return url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("application%2Fpdf");
}

function DocViewer({ url, label }: { url: string; label: string }) {
  const [enlarged, setEnlarged] = useState(false);
  const pdf = isPdf(url);

  return (
    <div className="border rounded-lg overflow-hidden bg-slate-50">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {pdf
            ? <FileText className="h-4 w-4 text-red-500" />
            : <ImageIcon className="h-4 w-4 text-blue-500" />}
          {label}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> Open in new tab
          </a>
          <a
            href={url}
            download
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Download className="h-3 w-3" /> Download
          </a>
        </div>
      </div>

      {/* Viewer */}
      {pdf ? (
        <iframe
          src={url}
          className="w-full"
          style={{ height: enlarged ? "900px" : "480px", border: "none" }}
          title={label}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label}
          onClick={() => setEnlarged(e => !e)}
          className="w-full object-contain cursor-zoom-in"
          style={{ maxHeight: enlarged ? "none" : "480px" }}
          title="Click to enlarge"
        />
      )}

      {/* Toggle size */}
      <button
        type="button"
        onClick={() => setEnlarged(e => !e)}
        className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors bg-white border-t"
      >
        {enlarged ? "▲ Collapse" : "▼ Expand"}
      </button>
    </div>
  );
}

export function ApplicationReviewPanel({ application }: Props) {
  const router = useRouter();
  const [rejectionReason, setRejectionReason] = useState(application.rejection_reason ?? "");
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function updateStatus(status: "verified" | "rejected") {
    setLoading(status === "verified" ? "approve" : "reject");
    const supabase = createClient();
    await supabase
      .from("seller_profiles")
      .update({
        status,
        ...(status === "verified" ? { verified_at: new Date().toISOString() } : {}),
        ...(status === "rejected" ? { rejection_reason: rejectionReason } : {}),
      })
      .eq("id", application.id);
    router.push("/admin/applications");
  }

  const p = application.profile;
  const isPending = application.status === "pending";
  const allDocs = [
    ...(application.trade_license_url ? [{ url: application.trade_license_url, label: "Business / Trade license" }] : []),
    ...(application.document_urls ?? []).map((url, i) => ({ url, label: `Supporting document ${i + 1}` })),
  ];
  const locationStr = [application.city, application.country].filter(Boolean).join(", ");

  const statusVariant: Record<string, "warning" | "success" | "destructive" | "secondary"> = {
    pending: "warning",
    verified: "success",
    rejected: "destructive",
    suspended: "secondary",
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/applications" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to applications
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{application.company_name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Applied {formatDate(application.created_at)}
          </p>
        </div>
        <Badge variant={statusVariant[application.status] ?? "secondary"} className="capitalize text-sm px-3 py-1">
          {application.status}
        </Badge>
      </div>

      <div className="space-y-5">

        {/* Company details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Company details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Detail icon={Building2} label="Company name"    value={application.company_name} />
            <Detail icon={Hash}      label="License / Reg. number" value={application.trade_license_number} mono />
            {locationStr && <Detail icon={MapPin}  label="Location" value={locationStr} />}
            {application.website && <Detail icon={Globe} label="Website" value={application.website} />}
          </CardContent>
        </Card>

        {/* Account holder */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Account holder
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Detail icon={User}  label="Full name" value={p.full_name} />
            <Detail icon={Mail}  label="Email"     value={p.email} />
            {p.phone   && <Detail icon={Phone}  label="Phone"   value={p.phone} />}
            {p.country && <Detail icon={Globe}  label="Country" value={p.country} />}
          </CardContent>
        </Card>

        {/* Company description */}
        {application.description && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">About the company</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {application.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Verification documents ─────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" /> Verification documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allDocs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No documents uploaded yet.
              </p>
            ) : (
              allDocs.map(({ url, label }) => (
                <DocViewer key={url} url={url} label={label} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Rejection reason (if already rejected) */}
        {application.status === "rejected" && application.rejection_reason && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-700">Rejection reason on file</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">{application.rejection_reason}</p>
            </CardContent>
          </Card>
        )}

        {/* ── Review actions ─────────────────────────────────────────────── */}
        {isPending && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Review decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Rejection reason <span className="text-muted-foreground font-normal">(required if rejecting)</span>
                </label>
                <Textarea
                  placeholder="e.g. The business registration document could not be verified. Please reapply with a clear, unobstructed copy of your official license or certificate of incorporation."
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => updateStatus("verified")}
                  disabled={!!loading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {loading === "approve" ? "Approving…" : "Approve & verify"}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updateStatus("rejected")}
                  disabled={!!loading || !rejectionReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {loading === "reject" ? "Rejecting…" : "Reject"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

function Detail({
  icon: Icon, label, value, mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`font-medium text-sm mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</div>
      </div>
    </div>
  );
}
