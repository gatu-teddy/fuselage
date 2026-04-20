"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { AFRICAN_COUNTRIES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X, Trash2 } from "lucide-react";

interface Props {
  listing: {
    id: string;
    type: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    mileage_km?: number;
    chassis_number?: string;
    engine_size?: string;
    price_usd: number;
    description?: string;
    status: string;
    availability: string;
    eta_date?: string;
    destination_ports: string[];
    features: string[];
  };
}

export function EditListingForm({ listing }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    model: listing.model,
    year: listing.year.toString(),
    color: listing.color ?? "",
    mileage_km: listing.mileage_km?.toString() ?? "0",
    chassis_number: listing.chassis_number ?? "",
    engine_size: listing.engine_size ?? "",
    price_usd: listing.price_usd.toString(),
    description: listing.description ?? "",
    availability: listing.availability,
    status: listing.status,
    eta_date: listing.eta_date ?? "",
  });

  const [destinationPorts, setDestinationPorts] = useState<string[]>(listing.destination_ports ?? []);
  const [features, setFeatures] = useState<string[]>(listing.features ?? []);
  const [featureInput, setFeatureInput] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function togglePort(port: string) {
    setDestinationPorts((prev) =>
      prev.includes(port) ? prev.filter((p) => p !== port) : [...prev, port]
    );
  }

  function addFeature() {
    const f = featureInput.trim();
    if (f && !features.includes(f)) {
      setFeatures((prev) => [...prev, f]);
      setFeatureInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("listings")
      .update({
        model: form.model,
        year: parseInt(form.year),
        color: form.color || null,
        mileage_km: parseInt(form.mileage_km) || 0,
        chassis_number: form.chassis_number || null,
        engine_size: form.engine_size || null,
        price_usd: parseFloat(form.price_usd),
        description: form.description || null,
        availability: form.availability,
        status: form.status,
        eta_date: form.availability !== "in_stock" && form.eta_date ? form.eta_date : null,
        destination_ports: destinationPorts,
        features,
      })
      .eq("id", listing.id);

    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/seller/listings");
  }

  async function handleDelete() {
    if (!confirm("Delete this listing permanently?")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", listing.id);
    router.push("/seller/listings");
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Edit listing</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {listing.year} {listing.make} {listing.model}
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
          <Trash2 className="h-4 w-4 mr-1" />
          {deleting ? "Deleting…" : "Delete listing"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</div>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Vehicle details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="model">Model *</Label>
              <Input id="model" value={form.model} onChange={(e) => update("model", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Year *</Label>
              <Input id="year" type="number" value={form.year} onChange={(e) => update("year", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" value={form.color} onChange={(e) => update("color", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input id="mileage" type="number" value={form.mileage_km} onChange={(e) => update("mileage_km", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="engine">Engine size</Label>
              <Input id="engine" value={form.engine_size} onChange={(e) => update("engine_size", e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="chassis">Chassis / VIN</Label>
              <Input id="chassis" value={form.chassis_number} onChange={(e) => update("chassis_number", e.target.value)} className="font-mono" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pricing & status</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (USD FOB Dubai) *</Label>
              <Input id="price" type="number" value={form.price_usd} onChange={(e) => update("price_usd", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Availability</Label>
              <Select value={form.availability} onValueChange={(v) => update("availability", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In stock</SelectItem>
                  <SelectItem value="en_route">En route</SelectItem>
                  <SelectItem value="pre_order">Pre-order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Listing status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft (hidden)</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.availability !== "in_stock" && (
              <div className="space-y-1.5">
                <Label htmlFor="eta">ETA date</Label>
                <Input id="eta" type="date" value={form.eta_date} onChange={(e) => update("eta_date", e.target.value)} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Destination ports</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {AFRICAN_COUNTRIES.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => togglePort(country)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-all",
                    destinationPorts.includes(country)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  {country}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Features</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add a feature…"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              />
              <Button type="button" variant="outline" onClick={addFeature}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span key={f} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-xs">
                  {f}
                  <button type="button" onClick={() => setFeatures((prev) => prev.filter((x) => x !== f))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving…" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
