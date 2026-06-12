"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { VEHICLE_MAKES } from "@/lib/types";
import { X, Car, Bike, Upload, ImageIcon, Star } from "lucide-react";

const c = {
  primary: "#0F172A", green: "#10B981", greenBg: "#D1FAE5", greenText: "#065F46",
  bg: "#F8FAFC", bgDim: "#F1F5F9", surface: "#FFFFFF", border: "#E2E8F0", muted: "#64748B",
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

type ImageEntry = { file: File; preview: string };

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState(""); // status text while saving
  const [error, setError] = useState("");
  const [type, setType] = useState<"car" | "bike">("car");
  const [steering, setSteering] = useState<"LHD" | "RHD">("RHD");
  const [form, setForm] = useState({
    make: "", model: "", year: new Date().getFullYear().toString(),
    color: "", mileage_km: "0", chassis_number: "", engine_size: "",
    price_usd: "", description: "", availability: "in_stock", eta_date: "",
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // ── Image state ───────────────────────────────────────────────────────────
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const acceptFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const incoming = Array.from(files)
      .filter(f => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024)
      .map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => {
      const combined = [...prev, ...incoming];
      return combined.slice(0, 10); // max 10
    });
  }, []);

  function removeImage(index: number) {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function setPrimary(index: number) {
    setImages(prev => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      return [item, ...next]; // move to front = primary
    });
  }

  // ── Form helpers ──────────────────────────────────────────────────────────
  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function addFeature() {
    const f = featureInput.trim();
    if (f && !features.includes(f)) { setFeatures(p => [...p, f]); setFeatureInput(""); }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setUploadStep("Creating listing…");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: sp } = await supabase.from("seller_profiles").select("destination_ports").eq("id", user.id).single();

    const { data: listing, error: err } = await supabase.from("listings").insert({
      seller_id: user.id, type,
      make: form.make, model: form.model, year: parseInt(form.year),
      color: form.color || null, mileage_km: parseInt(form.mileage_km) || 0,
      chassis_number: form.chassis_number || null, engine_size: form.engine_size || null,
      price_usd: parseFloat(form.price_usd), description: form.description || null,
      availability: form.availability,
      eta_date: form.availability !== "in_stock" && form.eta_date ? form.eta_date : null,
      destination_ports: sp?.destination_ports ?? [],
      features, status: "active", steering,
    }).select("id").single();

    if (err || !listing) { setError(err?.message ?? "Failed to create listing"); setLoading(false); setUploadStep(""); return; }

    // ── Upload images ────────────────────────────────────────────────────────
    if (images.length > 0) {
      setUploadStep(`Uploading ${images.length} photo${images.length > 1 ? "s" : ""}…`);
      const rows: { listing_id: string; url: string; position: number; is_primary: boolean }[] = [];

      for (let i = 0; i < images.length; i++) {
        const { file } = images[i];
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${listing.id}/${crypto.randomUUID()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("listing-images")
          .upload(path, file, { contentType: file.type });

        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(path);
          rows.push({ listing_id: listing.id, url: publicUrl, position: i, is_primary: i === 0 });
        }
      }

      if (rows.length > 0) {
        await supabase.from("listing_images").insert(rows);
      }
    }

    setUploadStep("Done!");
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

        {/* ── Vehicle type ───────────────────────────────────────────────── */}
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

        {/* ── Photos ────────────────────────────────────────────────────────── */}
        <Section title="Photos">
          <p style={{ color: c.muted, fontSize: "12px", marginBottom: "14px" }}>
            Upload up to 10 photos. The first photo is the cover image shown in search results. JPG, PNG, or WebP · max 10 MB each.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); acceptFiles(e.dataTransfer.files); }}
            onClick={() => imageInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? c.green : c.border}`,
              borderRadius: "10px", padding: "28px 20px",
              textAlign: "center", cursor: "pointer",
              backgroundColor: dragOver ? c.greenBg : c.bg,
              transition: "border-color 0.15s, background-color 0.15s",
              marginBottom: images.length > 0 ? "16px" : "0",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = c.green)}
            onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = c.border; }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Upload style={{ color: c.green, width: "18px", height: "18px" }} />
            </div>
            <p style={{ color: c.primary, fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
              {images.length === 0 ? "Click to upload or drag & drop" : `Add more photos (${images.length}/10)`}
            </p>
            <p style={{ color: c.muted, fontSize: "12px" }}>JPG, PNG, WebP · up to 10 MB each</p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={e => acceptFiles(e.target.files)}
              style={{ display: "none" }}
            />
          </div>

          {/* Image grid */}
          {images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
              {images.map((img, i) => (
                <div
                  key={img.preview}
                  style={{
                    position: "relative", borderRadius: "8px", overflow: "hidden",
                    border: `2px solid ${i === 0 ? c.green : c.border}`,
                    aspectRatio: "4/3", backgroundColor: c.bgDim,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

                  {/* Primary badge */}
                  {i === 0 && (
                    <div style={{ position: "absolute", bottom: "6px", left: "6px", backgroundColor: c.green, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Star style={{ width: "9px", height: "9px" }} /> Cover
                    </div>
                  )}

                  {/* Set primary button (not shown on index 0) */}
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setPrimary(i)}
                      title="Set as cover photo"
                      style={{ position: "absolute", bottom: "6px", left: "6px", backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "10px", fontWeight: 600, padding: "2px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
                    >
                      <Star style={{ width: "9px", height: "9px" }} /> Set cover
                    </button>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    style={{ position: "absolute", top: "6px", right: "6px", backgroundColor: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <X style={{ color: "#fff", width: "12px", height: "12px" }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", color: c.muted, fontSize: "12px" }}>
              <ImageIcon style={{ width: "14px", height: "14px" }} />
              Listings with photos get 3× more inquiries
            </div>
          )}
        </Section>

        {/* ── Vehicle details ───────────────────────────────────────────────── */}
        <Section title="Vehicle details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Make" required>
              <select value={form.make} onChange={e => update("make", e.target.value)} required style={{ ...fieldStyle, paddingRight: "32px" }}>
                <option value="">Select make</option>
                {makes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>

            <Field label="Model" required>
              <input placeholder="G63 AMG" value={form.model} onChange={e => update("model", e.target.value)} required style={fieldStyle} />
            </Field>

            <Field label="Year" required>
              <input type="number" min="2000" max="2030" value={form.year} onChange={e => update("year", e.target.value)} required style={fieldStyle} />
            </Field>

            <Field label="Colour">
              <input placeholder="Obsidian Black Metallic" value={form.color} onChange={e => update("color", e.target.value)} style={fieldStyle} />
            </Field>

            <Field label="Mileage (km)">
              <input type="number" min="0" value={form.mileage_km} onChange={e => update("mileage_km", e.target.value)} style={fieldStyle} />
            </Field>

            <Field label="Engine size">
              <input placeholder="4.0L V8 Biturbo" value={form.engine_size} onChange={e => update("engine_size", e.target.value)} style={fieldStyle} />
            </Field>

            <Field label="Steering">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {(["LHD", "RHD"] as const).map(s => (
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

            <Field label="Chassis / VIN" hint="Hidden from public — revealed only to buyers who send an inquiry.">
              <input
                placeholder="WDC4632231X345812"
                value={form.chassis_number}
                onChange={e => update("chassis_number", e.target.value)}
                style={{ ...fieldStyle, fontFamily: "monospace" }}
              />
            </Field>
          </div>
        </Section>

        {/* ── Pricing & availability ────────────────────────────────────────── */}
        <Section title="Pricing & availability">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Price (USD FOB)" required hint="FOB = Free On Board at origin port. Excludes shipping.">
              <input type="number" min="1000" placeholder="85000" value={form.price_usd} onChange={e => update("price_usd", e.target.value)} required style={fieldStyle} />
            </Field>

            <Field label="Availability" required>
              <select value={form.availability} onChange={e => update("availability", e.target.value)} style={{ ...fieldStyle, paddingRight: "32px" }}>
                <option value="in_stock">In stock (ready to ship)</option>
                <option value="en_route">En route (already shipped)</option>
                <option value="pre_order">Pre-order (can be sourced)</option>
              </select>
            </Field>
          </div>

          {form.availability !== "in_stock" && (
            <div style={{ marginTop: "16px" }}>
              <Field label="ETA date">
                <input type="date" value={form.eta_date} onChange={e => update("eta_date", e.target.value)} style={fieldStyle} />
              </Field>
            </div>
          )}
        </Section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <Section title="Features & highlights">
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              placeholder="e.g. Panoramic sunroof, Night vision, Burmester audio…"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
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
            {features.map(f => (
              <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: c.greenBg, color: c.greenText, fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px" }}>
                {f}
                <button type="button" onClick={() => setFeatures(p => p.filter(x => x !== f))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: c.greenText, display: "flex" }}>
                  <X style={{ width: "11px", height: "11px" }} />
                </button>
              </span>
            ))}
          </div>
        </Section>

        {/* ── Description ──────────────────────────────────────────────────── */}
        <Section title="Description">
          <textarea
            placeholder="Add any additional details about this vehicle, its history, condition, or special notes for buyers…"
            rows={5}
            value={form.description}
            onChange={e => update("description", e.target.value)}
            style={{ ...fieldStyle, height: "auto", padding: "10px 12px", resize: "vertical" }}
          />
        </Section>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit" disabled={loading}
            style={{ flex: 1, height: "46px", backgroundColor: loading ? c.muted : c.primary, color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (uploadStep || "Publishing…") : "Publish listing"}
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
