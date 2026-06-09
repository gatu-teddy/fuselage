"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { VEHICLE_MAKES } from "@/lib/types";
import { X, Car, Bike } from "lucide-react";

const c = {
  primary: "#0F172A", green: "#10B981", greenBg: "#D1FAE5", greenText: "#065F46",
  bg: "#F8FAFC", surface: "#FFFFFF", border: "#E2E8F0", muted: "#64748B",
  body: "#334155", error: "#EF4444", errorBg: "#FEF2F2",
};

const fieldStyle: React.CSSProperties = {
  width: "100%", height: "42px", border: `1px solid ${c.border}`, borderRadius: "8px",
  padding: "0 12px", fontSize: "14px", outline: "none",
  color: c.primary, backgroundColor: c.surface, boxSizing: "border-box",
  fontFamily: "Inter, sans-serif",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "24px", marginBottom: "20px" }}>
      <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
        {label}{required && <span style={{ color: c.error, marginLeft: "2px" }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ color: c.muted, fontSize: "11px", marginTop: "5px" }}>{hint}</p>}
    </div>
  );
}

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<"car" | "bike">("car");
  const [steering, setSteering] = useState<"LHD" | "RHD">("LHD");
  const [form, setForm] = useState({
    make: "", model: "", year: new Date().getFullYear().toString(),
    color: "", mileage_km: "0", chassis_number: "", engine_size: "",
    price_usd: "", description: "", availability: "in_stock", eta_date: "",
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addFeature() {
    const f = featureInput.trim();
    if (f && !features.includes(f)) { setFeatures((p) => [...p, f]); setFeatureInput(""); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Pull seller's destination ports from their profile
    const { data: sp } = await supabase.from("seller_profiles").select("destination_ports").eq("id", user.id).single();

    const { error: err } = await supabase.from("listings").insert({
      seller_id: user.id, type,
      make: form.make, model: form.model, year: parseInt(form.year),
      color: form.color || null, mileage_km: parseInt(form.mileage_km) || 0,
      chassis_number: form.chassis_number || null, engine_size: form.engine_size || null,
      price_usd: parseFloat(form.price_usd), description: form.description || null,
      availability: form.availability,
      eta_date: form.availability !== "in_stock" && form.eta_date ? form.eta_date : null,
      destination_ports: sp?.destination_ports ?? [],
      features, status: "active", steering,
    });

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/seller/listings");
  }

  const makes = VEHICLE_MAKES[type];

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Add new listing</h1>
        <p style={{ color: c.muted, fontSize: "14px", marginTop: "4px" }}>All fields marked * are required</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ backgroundColor: c.errorBg, border: `1px solid ${c.error}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
            <p style={{ color: c.error, fontSize: "13px", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Vehicle type */}
        <Section title="Vehicle type *">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {([["car", "Car", Car], ["bike", "Bike", Bike]] as const).map(([t, label, Icon]) => (
              <button
                key={t} type="button"
                onClick={() => { setType(t); update("make", ""); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  border: `2px solid ${type === t ? c.green : c.border}`,
                  borderRadius: "10px", padding: "14px",
                  backgroundColor: type === t ? c.greenBg : c.surface,
                  cursor: "pointer", fontSize: "14px", fontWeight: 600,
                  color: type === t ? c.greenText : c.muted,
                }}
              >
                <Icon style={{ width: "18px", height: "18px" }} /> {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Vehicle details */}
        <Section title="Vehicle details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Make" required>
              <select
                value={form.make}
                onChange={(e) => update("make", e.target.value)}
                required
                style={{ ...fieldStyle, paddingRight: "32px" }}
              >
                <option value="">Select make</option>
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>

            <Field label="Model" required>
              <input placeholder="G63 AMG" value={form.model} onChange={(e) => update("model", e.target.value)} required style={fieldStyle} />
            </Field>

            <Field label="Year" required>
              <input type="number" min="2000" max="2030" value={form.year} onChange={(e) => update("year", e.target.value)} required style={fieldStyle} />
            </Field>

            <Field label="Colour">
              <input placeholder="Obsidian Black Metallic" value={form.color} onChange={(e) => update("color", e.target.value)} style={fieldStyle} />
            </Field>

            <Field label="Mileage (km)">
              <input type="number" min="0" value={form.mileage_km} onChange={(e) => update("mileage_km", e.target.value)} style={fieldStyle} />
            </Field>

            <Field label="Engine size">
              <input placeholder="4.0L V8 Biturbo" value={form.engine_size} onChange={(e) => update("engine_size", e.target.value)} style={fieldStyle} />
            </Field>

            <Field label="Steering">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {(["LHD", "RHD"] as const).map((s) => (
                  <button
                    key={s} type="button"
                    onClick={() => setSteering(s)}
                    style={{
                      height: "42px", border: `2px solid ${steering === s ? c.green : c.border}`,
                      borderRadius: "8px", fontSize: "13px", fontWeight: 700,
                      backgroundColor: steering === s ? c.greenBg : c.surface,
                      color: steering === s ? c.greenText : c.muted, cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Chassis / VIN" hint="Visible to buyers. Builds trust and confirms vehicle identity.">
              <input
                placeholder="WDC4632231X345812"
                value={form.chassis_number}
                onChange={(e) => update("chassis_number", e.target.value)}
                style={{ ...fieldStyle, fontFamily: "monospace" }}
              />
            </Field>
          </div>
        </Section>

        {/* Pricing & availability */}
        <Section title="Pricing & availability">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Price (USD FOB Dubai)" required hint="FOB = Free On Board at UAE port. Excludes shipping.">
              <input type="number" min="1000" placeholder="85000" value={form.price_usd} onChange={(e) => update("price_usd", e.target.value)} required style={fieldStyle} />
            </Field>

            <Field label="Availability" required>
              <select value={form.availability} onChange={(e) => update("availability", e.target.value)} style={{ ...fieldStyle, paddingRight: "32px" }}>
                <option value="in_stock">In stock (ready to ship)</option>
                <option value="en_route">En route (already shipped)</option>
                <option value="pre_order">Pre-order (can be sourced)</option>
              </select>
            </Field>
          </div>

          {form.availability !== "in_stock" && (
            <div style={{ marginTop: "16px" }}>
              <Field label="ETA date">
                <input type="date" value={form.eta_date} onChange={(e) => update("eta_date", e.target.value)} style={fieldStyle} />
              </Field>
            </div>
          )}
        </Section>

        {/* Features */}
        <Section title="Features & highlights">
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              placeholder="e.g. Panoramic sunroof, Night vision, Burmester audio…"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              style={{ ...fieldStyle, flex: 1 }}
            />
            <button
              type="button" onClick={addFeature}
              style={{ height: "42px", padding: "0 16px", border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: c.primary, backgroundColor: c.surface, cursor: "pointer" }}
            >
              Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {features.map((f) => (
              <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: c.greenBg, color: c.greenText, fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px" }}>
                {f}
                <button type="button" onClick={() => setFeatures((p) => p.filter((x) => x !== f))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: c.greenText, display: "flex" }}>
                  <X style={{ width: "11px", height: "11px" }} />
                </button>
              </span>
            ))}
          </div>
        </Section>

        {/* Description */}
        <Section title="Description">
          <textarea
            placeholder="Add any additional details about this vehicle, its history, condition, or special notes for buyers…"
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            style={{ ...fieldStyle, height: "auto", padding: "10px 12px", resize: "vertical" }}
          />
        </Section>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit" disabled={loading}
            style={{ flex: 1, height: "46px", backgroundColor: loading ? c.muted : c.primary, color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Publishing…" : "Publish listing"}
          </button>
          <button
            type="button" onClick={() => router.back()}
            style={{ height: "46px", padding: "0 20px", border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: c.body, backgroundColor: c.surface, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
