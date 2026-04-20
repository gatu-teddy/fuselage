"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Shield, CheckCircle } from "lucide-react";

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    trade_license_number: "",
    city: "Dubai",
    website: "",
    description: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("seller_profiles").insert({
      id: user.id,
      ...form,
      status: "pending",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Application submitted</h1>
          <p className="text-muted-foreground mb-6">
            Our team will review your trade license and company details within 1–2 business days.
            You will receive an email once your account is verified and you can start listing.
          </p>
          <Button onClick={() => router.push("/seller/dashboard")}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-gold-500" />
            <span className="text-sm font-medium text-muted-foreground">Exporter verification</span>
          </div>
          <h1 className="text-2xl font-bold">Set up your exporter profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Required before your listings go live. Takes 2 minutes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company information</CardTitle>
            <CardDescription>
              We verify every exporter. Ensure these match your official trade license.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="company_name">Company name *</Label>
                <Input
                  id="company_name"
                  placeholder="Al Rashidi Motors LLC"
                  value={form.company_name}
                  onChange={(e) => update("company_name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="trade_license">UAE Trade license number *</Label>
                <Input
                  id="trade_license"
                  placeholder="DED-123456"
                  value={form.trade_license_number}
                  onChange={(e) => update("trade_license_number", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Issued by DED, Sharjah Economic Department, or equivalent UAE authority.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>City *</Label>
                <Select value={form.city} onValueChange={(v) => update("city", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dubai">Dubai</SelectItem>
                    <SelectItem value="Sharjah">Sharjah</SelectItem>
                    <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                    <SelectItem value="Ajman">Ajman</SelectItem>
                    <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://alrashidimotors.ae"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">About your company *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your company, specialties, brands you deal in, and export experience…"
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  required
                />
              </div>

              <div className="rounded-md bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                You may also be asked to upload a copy of your trade license by email after submission.
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting…" : "Submit for verification"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
