"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { AFRICAN_COUNTRIES } from "@/lib/types";
import { MessageSquare, LogIn } from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface Props {
  listingId: string;
  sellerId: string;
  listingTitle: string;
  currentUser: User | null;
}

export function InquiryForm({ listingId, sellerId, listingTitle, currentUser }: Props) {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-5 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to send an inquiry to the exporter
          </p>
          <Button asChild className="w-full">
            <Link href={`/login?redirect=/listings/${listingId}`}>
              <LogIn className="h-4 w-4 mr-2" /> Sign in to inquire
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-5 text-center">
          <div className="text-2xl mb-2">✓</div>
          <div className="font-semibold text-green-800 text-sm">Inquiry sent</div>
          <p className="text-green-700 text-xs mt-1 mb-4">
            The exporter will respond through your deals dashboard.
          </p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/buyer/deals">View my deals</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!country) { setError("Please select your destination country."); return; }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("deals").insert({
      listing_id: listingId,
      buyer_id: currentUser!.id,
      seller_id: sellerId,
      status: "inquired",
      destination_country: country,
      buyer_notes: notes || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Send inquiry
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</div>
          )}
          <div className="space-y-1.5">
            <Label>Your destination country *</Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {AFRICAN_COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Any specific questions about this vehicle, shipping timeline, inspection, etc."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send inquiry"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            The exporter will respond within 24–48 hours.
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
