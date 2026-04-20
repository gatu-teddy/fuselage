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
import { VEHICLE_MAKES, AFRICAN_COUNTRIES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const UAE_PORTS = ["Jebel Ali (Dubai)", "Sharjah Port", "Port Rashid"];

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState<"car" | "bike">("car");
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    color: "",
    mileage_km: "0",
    chassis_number: "",
    engine_size: "",
    price_usd: "",
    description: "",
    availability: "in_stock",
    eta_date: "",
  });
  const [destinationPorts, setDestinationPorts] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("listings").insert({
      seller_id: user.id,
      type,
      make: form.make,
      model: form.model,
      year: parseInt(form.year),
      color: form.color || null,
      mileage_km: parseInt(form.mileage_km) || 0,
      chassis_number: form.chassis_number || null,
      engine_size: form.engine_size || null,
      price_usd: parseFloat(form.price_usd),
      description: form.description || null,
      availability: form.availability,
      eta_date: form.availability !== "in_stock" && form.eta_date ? form.eta_date : null,
      destination_ports: destinationPorts,
      features,
      status: "active",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/seller/listings");
  }

  const makes = VEHICLE_MAKES[type];

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add new listing</h1>
        <p className="text-muted-foreground text-sm mt-1">All fields marked * are required</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</div>
        )}

        {/* Vehicle type */}
        <Card>
          <CardHeader><CardTitle className="text-base">Vehicle type *</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(["car", "bike"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); update("make", ""); }}
                  className={cn(
                    "flex-1 rounded-lg border-2 py-3 text-sm font-medium capitalize transition-all",
                    type === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  {t === "car" ? "🚗" : "🏍️"} {t}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Basic details */}
        <Card>
          <CardHeader><CardTitle className="text-base">Vehicle details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Make *</Label>
              <Select value={form.make} onValueChange={(v) => update("make", v)} required>
                <SelectTrigger><SelectValue placeholder="Select make" /></SelectTrigger>
                <SelectContent>
                  {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="S-Class"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="2000"
                max="2030"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="Obsidian Black"
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                value={form.mileage_km}
                onChange={(e) => update("mileage_km", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="engine_size">Engine size</Label>
              <Input
                id="engine_size"
                placeholder="4.0L V8 Biturbo"
                value={form.engine_size}
                onChange={(e) => update("engine_size", e.target.value)}
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="chassis_number">Chassis / VIN number</Label>
              <Input
                id="chassis_number"
                placeholder="WDD2220561A123456"
                value={form.chassis_number}
                onChange={(e) => update("chassis_number", e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Visible to buyers. Builds trust and confirms vehicle identity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & availability */}
        <Card>
          <CardHeader><CardTitle className="text-base">Pricing & availability</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (USD FOB Dubai) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1000"
                  placeholder="85000"
                  value={form.price_usd}
                  onChange={(e) => update("price_usd", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">FOB = Free On Board at UAE port. Excludes shipping.</p>
              </div>

              <div className="space-y-1.5">
                <Label>Availability *</Label>
                <Select value={form.availability} onValueChange={(v) => update("availability", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In stock (ready to ship)</SelectItem>
                    <SelectItem value="en_route">En route (already shipped)</SelectItem>
                    <SelectItem value="pre_order">Pre-order (can be sourced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.availability !== "in_stock" && (
              <div className="space-y-1.5">
                <Label htmlFor="eta">ETA date</Label>
                <Input
                  id="eta"
                  type="date"
                  value={form.eta_date}
                  onChange={(e) => update("eta_date", e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Destination ports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Destination ports you ship to</CardTitle>
          </CardHeader>
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

        {/* Features */}
        <Card>
          <CardHeader><CardTitle className="text-base">Features & highlights</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Panoramic sunroof, Night vision, Burmester audio…"
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

        {/* Description */}
        <Card>
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any additional details about this vehicle, its history, condition, or special notes for buyers…"
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Publishing…" : "Publish listing"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
