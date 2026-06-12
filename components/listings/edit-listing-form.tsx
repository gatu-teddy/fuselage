"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Trash2, Upload, Star, ImageIcon } from "lucide-react";

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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>{label}</label>
      {children}
      {hint && <p style={{ color: c.muted, fontSize: "11px", marginTop: "5px" }}>{hint}</p>}
    </div>
  );
}

type ExistingImage = { id: string; url: string; is_primary: boolean; position: number };
type NewImage = { file: File; preview: string };

interface Props {
  listing: {
    id: string; type: string; make: string; model: string; year: number;
    color?: string; mileage_km?: number; chassis_number?: string; engine_size?: string;
    price_usd: number; description?: string; status: string; availability: string;
    eta_date?: string; destination_ports: string[]; features: string[]; steering?: string;
  };
  existingImages: ExistingImage[];
}

export function EditListingForm({ listing, existingImages }: Props) {
  const router = useRouter();
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]     = useState("");
  const [saveStep, setSaveStep] = useState("");
  const [steering, setSteering] = useState<"LHD" | "RHD">((listing.steering as "LHD" | "RHD") ?? "RHD");

  const [form, setForm] = useState({
    model:          listing.model,
    year:           listing.year.toString(),
    color:          listing.color ?? "",
    mileage_km:     listing.mileage_km?.toString() ?? "0",
    chassis_number: listing.chassis_number ?? "",
    engine_size:    listing.engine_size ?? "",
    price_usd:      listing.price_usd.toString(),
    description:    listing.description ?? "",
    availability:   listing.availability,
    status:         listing.status,
    eta_date:       listing.eta_date ?? "",
  });

  const [features, setFeatures]         = useState<string[]>(listing.features ?? []);
  const [featureInput, setFeatureInput] = useState("");

  // ── Image state ────────────────────────────────────────────────────────────
  // existing: kept or marked for removal
  const [kept, setKept]           = useState<ExistingImage[]>(existingImages);
  const [toDelete, setToDelete]   = useState<string[]>([]); // listing_images IDs
  // new images to upload
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [dragOver, setDragOver]   = useState(false);
  const imgInputRef               = useRef<HTMLInputElement>(null);

  const acceptNewFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const incoming = Array.from(files)
      .filter(f => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024)
      .map(file => ({ file, preview: URL.createObjectURL(file) }));
    setNewImages(prev => [...prev, ...incoming].slice(0, 10 - kept.length));
  }, [kept.length]);

  function removeExisting(img: ExistingImage) {
    setKept(prev => prev.filter(i => i.id !== img.id));
    setToDelete(prev => [...prev, img.id]);
  }

  function setExistingPrimary(img: ExistingImage) {
    // Move to front of kept array (renders as cover)
    setKept(prev => [img, ...prev.filter(i => i.id !== img.id)]);
  }

  function removeNew(index: number) {
    setNewImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function setNewPrimary(index: number) {
    // If there are existing images, demote them all and put this new image conceptually first
    // We do this by clearing kept (they become non-primary) and moving this new image to front
    setNewImages(prev => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      return [item, ...next];
    });
    // Clear existing primary so the new one wins
    setKept(prev => prev.map(i => ({ ...i, is_primary: false })));
  }

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function addFeature() {
    const f = featureInput.trim();
    if (f && !features.includes(f)) { setFeatures(p => [...p, f]); setFeatureInput(""); }
  }

  // Extract storage path from a public URL: "{listing_id}/{filename}"
  function storagePathFromUrl(url: string) {
    const marker = "/listing-images/";
    const idx = url.indexOf(marker);
    return idx >= 0 ? decodeURIComponent(url.slice(idx + marker.length).split("?")[0]) : null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(""); setSaveStep("Saving changes…");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // 1. Update core listing fields
    const { error: updErr } = await supabase.from("listings").update({
      model: form.model, year: parseInt(form.year),
      color: form.color || null, mileage_km: parseInt(form.mileage_km) || 0,
      chassis_number: form.chassis_number || null, engine_size: form.engine_size || null,
      price_usd: parseFloat(form.price_usd), description: form.description || null,
      availability: form.availability, status: form.status, steering,
      eta_date: form.availability !== "in_stock" && form.eta_date ? form.eta_date : null,
      features,
    }).eq("id", listing.id);

    if (updErr) { setError(updErr.message); setSaving(false); setSaveStep(""); return; }

    // 2. Delete removed images from storage + DB
    if (toDelete.length > 0) {
      setSaveStep("Removing deleted photos…");
      for (const imgId of toDelete) {
        const img = existingImages.find(i => i.id === imgId);
        if (img) {
          const path = storagePathFromUrl(img.url);
          if (path) await supabase.storage.from("listing-images").remove([path]);
        }
        await supabase.from("listing_images").delete().eq("id", imgId);
      }
    }

    // 3. Update primary flag on kept images
    for (let i = 0; i < kept.length; i++) {
      await supabase.from("listing_images").update({ is_primary: i === 0 && newImages.length === 0, position: i }).eq("id", kept[i].id);
    }

    // 4. Upload new images
    if (newImages.length > 0) {
      setSaveStep(`Uploading ${newImages.length} new photo${newImages.length > 1 ? "s" : ""}…`);
      const rows: { listing_id: string; url: string; position: number; is_primary: boolean }[] = [];

      for (let i = 0; i < newImages.length; i++) {
        const { file } = newImages[i];
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${listing.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("listing-images").upload(path, file, { contentType: file.type });
        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(path);
          rows.push({ listing_id: listing.id, url: publicUrl, position: kept.length + i, is_primary: i === 0 && kept.length === 0 });
        }
      }
      if (rows.length > 0) await supabase.from("listing_images").insert(rows);
    }

    setSaveStep("Done!");
    router.push("/seller/listings");
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this listing and all its photos?")) return;
    setDeleting(true);
    const supabase = createClient();
    // Delete all images from storage first
    const paths = existingImages.map(i => storagePathFromUrl(i.url)).filter(Boolean) as string[];
    if (paths.length > 0) await supabase.storage.from("listing-images").remove(paths);
    await supabase.from("listings").delete().eq("id", listing.id);
    router.push("/seller/listings");
  }

  const totalImages = kept.length + newImages.length;

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Edit listing</h1>
          <p style={{ color: c.muted, fontSize: "14px", marginTop: "4px" }}>{listing.year} {listing.make} {listing.model}</p>
        </div>
        <button
          type="button" onClick={handleDelete} disabled={deleting}
          style={{ display: "flex", alignItems: "center", gap: "6px", height: "38px", padding: "0 16px", backgroundColor: c.errorBg, color: c.error, border: `1px solid ${c.error}40`, borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer" }}
        >
          <Trash2 style={{ width: "14px", height: "14px" }} />
          {deleting ? "Deleting…" : "Delete listing"}
        </button>
      </div>

      <form onSubmit={handleSave}>
        {error && (
          <div style={{ backgroundColor: c.errorBg, border: `1px solid ${c.error}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
            <p style={{ color: c.error, fontSize: "13px", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* ── Photos ──────────────────────────────────────────────────────── */}
        <Section title="Photos">
          <p style={{ color: c.muted, fontSize: "12px", marginBottom: "14px" }}>
            First photo is the cover shown in search results. Up to 10 total. JPG, PNG, WebP · max 10 MB each.
          </p>

          {/* Existing images */}
          {(kept.length > 0 || newImages.length > 0) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", marginBottom: "12px" }}>
              {/* Kept existing */}
              {kept.map((img, i) => (
                <div key={img.id} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: `2px solid ${i === 0 && newImages.length === 0 ? c.green : c.border}`, aspectRatio: "4/3", backgroundColor: c.bgDim }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {i === 0 && newImages.length === 0 && (
                    <div style={{ position: "absolute", bottom: "6px", left: "6px", backgroundColor: c.green, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Star style={{ width: "9px", height: "9px" }} /> Cover
                    </div>
                  )}
                  {(i > 0 || newImages.length > 0) && (
                    <button type="button" onClick={() => setExistingPrimary(img)} title="Set as cover" style={{ position: "absolute", bottom: "6px", left: "6px", backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "10px", fontWeight: 600, padding: "2px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Star style={{ width: "9px", height: "9px" }} /> Cover
                    </button>
                  )}
                  <button type="button" onClick={() => removeExisting(img)} style={{ position: "absolute", top: "6px", right: "6px", backgroundColor: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X style={{ color: "#fff", width: "12px", height: "12px" }} />
                  </button>
                </div>
              ))}

              {/* New images */}
              {newImages.map((img, i) => (
                <div key={img.preview} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: `2px solid ${i === 0 && kept.length === 0 ? c.green : c.border}`, aspectRatio: "4/3", backgroundColor: c.bgDim }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {i === 0 && kept.length === 0 && (
                    <div style={{ position: "absolute", bottom: "6px", left: "6px", backgroundColor: c.green, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Star style={{ width: "9px", height: "9px" }} /> Cover
                    </div>
                  )}
                  {(i > 0 || kept.length > 0) && (
                    <button type="button" onClick={() => setNewPrimary(i)} title="Set as cover" style={{ position: "absolute", bottom: "6px", left: "6px", backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "10px", fontWeight: 600, padding: "2px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Star style={{ width: "9px", height: "9px" }} /> Cover
                    </button>
                  )}
                  <button type="button" onClick={() => removeNew(i)} style={{ position: "absolute", top: "6px", right: "6px", backgroundColor: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X style={{ color: "#fff", width: "12px", height: "12px" }} />
                  </button>
                  {/* "New" badge */}
                  <div style={{ position: "absolute", top: "6px", left: "6px", backgroundColor: c.primary, color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>NEW</div>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          {totalImages < 10 && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); acceptNewFiles(e.dataTransfer.files); }}
              onClick={() => imgInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? c.green : c.border}`, borderRadius: "10px",
                padding: totalImages > 0 ? "16px" : "28px 20px",
                textAlign: "center", cursor: "pointer",
                backgroundColor: dragOver ? c.greenBg : c.bg,
                transition: "border-color 0.15s, background-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = c.green)}
              onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = c.border; }}
            >
              {totalImages > 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Upload style={{ color: c.green, width: "15px", height: "15px" }} />
                  <span style={{ color: c.primary, fontWeight: 600, fontSize: "13px" }}>Add more photos</span>
                  <span style={{ color: c.muted, fontSize: "12px" }}>({totalImages}/10)</span>
                </div>
              ) : (
                <>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Upload style={{ color: c.green, width: "18px", height: "18px" }} />
                  </div>
                  <p style={{ color: c.primary, fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>Click to upload or drag & drop</p>
                  <p style={{ color: c.muted, fontSize: "12px" }}>JPG, PNG, WebP · up to 10 MB each</p>
                </>
              )}
              <input ref={imgInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => acceptNewFiles(e.target.files)} style={{ display: "none" }} />
            </div>
          )}

          {totalImages === 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", color: c.muted, fontSize: "12px" }}>
              <ImageIcon style={{ width: "14px", height: "14px" }} />
              Listings with photos get 3× more inquiries
            </div>
          )}
        </Section>

        {/* ── Vehicle details ───────────────────────────────────────────────── */}
        <Section title="Vehicle details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Model *">
              <input value={form.model} onChange={e => update("model", e.target.value)} required style={fieldStyle} />
            </Field>
            <Field label="Year *">
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
                  <button key={s} type="button" onClick={() => setSteering(s)} style={{ height: "42px", border: `2px solid ${steering === s ? c.green : c.border}`, borderRadius: "8px", fontSize: "13px", fontWeight: 700, backgroundColor: steering === s ? c.greenBg : c.surface, color: steering === s ? c.greenText : c.muted, cursor: "pointer" }}>
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <div className="col-span-2" style={{ gridColumn: "1 / -1" }}>
              <Field label="Chassis / VIN" hint="Hidden from public — revealed only to buyers who send an inquiry.">
                <input
                  placeholder="WDC4632231X345812"
                  value={form.chassis_number}
                  onChange={e => update("chassis_number", e.target.value)}
                  style={{ ...fieldStyle, fontFamily: "monospace" }}
                />
              </Field>
            </div>
          </div>
        </Section>

        {/* ── Pricing & status ───────────────────────────────────────────────── */}
        <Section title="Pricing & status">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Price (USD FOB) *" hint="FOB = Free On Board at origin port. Excludes shipping.">
              <input type="number" min="1000" value={form.price_usd} onChange={e => update("price_usd", e.target.value)} required style={fieldStyle} />
            </Field>
            <Field label="Availability">
              <select value={form.availability} onChange={e => update("availability", e.target.value)} style={{ ...fieldStyle, paddingRight: "32px" }}>
                <option value="in_stock">In stock (ready to ship)</option>
                <option value="en_route">En route (already shipped)</option>
                <option value="pre_order">Pre-order (can be sourced)</option>
              </select>
            </Field>
            <Field label="Listing status">
              <select value={form.status} onChange={e => update("status", e.target.value)} style={{ ...fieldStyle, paddingRight: "32px" }}>
                <option value="active">Active</option>
                <option value="draft">Draft (hidden)</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </Field>
            {form.availability !== "in_stock" && (
              <Field label="ETA date">
                <input type="date" value={form.eta_date} onChange={e => update("eta_date", e.target.value)} style={fieldStyle} />
              </Field>
            )}
          </div>
        </Section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <Section title="Features & highlights">
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              placeholder="e.g. Panoramic sunroof, Night vision…"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              style={{ ...fieldStyle, flex: 1 }}
            />
            <button type="button" onClick={addFeature} style={{ height: "42px", padding: "0 16px", border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: c.primary, backgroundColor: c.surface, cursor: "pointer" }}>
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
            placeholder="Add any additional details about this vehicle…"
            rows={5}
            value={form.description}
            onChange={e => update("description", e.target.value)}
            style={{ ...fieldStyle, height: "auto", padding: "10px 12px", resize: "vertical" }}
          />
        </Section>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit" disabled={saving}
            style={{ flex: 1, height: "46px", backgroundColor: saving ? c.muted : c.primary, color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? (saveStep || "Saving…") : "Save changes"}
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
