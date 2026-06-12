"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Shield, CheckCircle, Upload, X, FileText, ImageIcon, AlertTriangle, Plus,
} from "lucide-react";

const c = {
  primary:   "#0F172A",
  green:     "#10B981",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  bg:        "#F8FAFC",
  surface:   "#FFFFFF",
  border:    "#E2E8F0",
  muted:     "#64748B",
  body:      "#334155",
  amber:     "#F59E0B",
  amberBg:   "#FEF3C7",
  error:     "#EF4444",
  errorBg:   "#FEF2F2",
};

const fieldStyle: React.CSSProperties = {
  width: "100%", height: "42px", border: `1px solid ${c.border}`, borderRadius: "8px",
  padding: "0 12px", fontSize: "14px", outline: "none",
  color: c.primary, backgroundColor: c.surface, boxSizing: "border-box",
  fontFamily: "Inter, sans-serif",
};

const labelStyle: React.CSSProperties = {
  color: c.primary, fontSize: "13px", fontWeight: 600,
  display: "block", marginBottom: "6px",
};

const exporterCountries = [
  "UAE", "Nigeria", "Ghana", "Kenya", "Tanzania", "Libya", "Ethiopia",
  "Pakistan", "Saudi Arabia", "Jordan", "Egypt", "South Africa", "Other",
];

// Example document types by country for the hint text
const docExamples: Record<string, string> = {
  UAE:          "Trade License (DED / DDA / JAFZA)",
  Nigeria:      "CAC Certificate of Incorporation",
  Ghana:        "Registrar General's Certificate",
  Kenya:        "Certificate of Incorporation (CAK)",
  Tanzania:     "Business Registration Certificate (BRELA)",
  Libya:        "Commercial Registration Certificate",
  Ethiopia:     "Ministry of Trade Business License",
  Pakistan:     "SECP Certificate of Incorporation",
  "Saudi Arabia": "Commercial Registration (CR)",
  Jordan:       "Commercial Registration Certificate",
  Egypt:        "Commercial Registration Certificate",
  "South Africa": "CIPC Certificate of Incorporation",
  Other:        "Official business license or certificate of incorporation",
};

type UploadFile = { file: File; preview?: string };

function FileCard({
  uf,
  onRemove,
  label,
}: {
  uf: UploadFile;
  onRemove: () => void;
  label: string;
}) {
  return (
    <div style={{ border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
      {uf.preview ? (
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={uf.preview} alt={label} style={{ width: "100%", maxHeight: "160px", objectFit: "cover", display: "block" }} />
          <button type="button" onClick={onRemove} style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X style={{ color: "#fff", width: "14px", height: "14px" }} />
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ backgroundColor: c.errorBg, width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText style={{ color: c.error, width: "16px", height: "16px" }} />
            </div>
            <div>
              <p style={{ color: c.primary, fontSize: "13px", fontWeight: 600 }}>{uf.file.name}</p>
              <p style={{ color: c.muted, fontSize: "11px" }}>{(uf.file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <button type="button" onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: c.muted, display: "flex" }}>
            <X style={{ width: "15px", height: "15px" }} />
          </button>
        </div>
      )}
      <div style={{ borderTop: `1px solid ${c.border}`, padding: "8px 14px", backgroundColor: c.bg, display: "flex", alignItems: "center", gap: "6px" }}>
        <ImageIcon style={{ color: c.green, width: "12px", height: "12px" }} />
        <span style={{ color: c.greenText, fontSize: "11px", fontWeight: 600 }}>{label}</span>
        <span style={{ color: c.muted, fontSize: "11px", marginLeft: "auto" }}>{(uf.file.size / 1024).toFixed(0)} KB</span>
      </div>
    </div>
  );
}

function DropZone({ onFile, compact = false }: { onFile: (f: File) => void; compact?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  function tryFile(file: File | undefined) {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) return;
    if (file.size > 10 * 1024 * 1024) return;
    onFile(file);
  }
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); tryFile(e.dataTransfer.files[0]); }}
      onClick={() => ref.current?.click()}
      style={{
        border: `2px dashed ${c.border}`, borderRadius: "10px",
        padding: compact ? "16px" : "28px 20px",
        textAlign: "center", cursor: "pointer", backgroundColor: c.bg,
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.green)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = c.border)}
    >
      {compact ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Plus style={{ color: c.green, width: "15px", height: "15px" }} />
          <span style={{ color: c.primary, fontWeight: 600, fontSize: "13px" }}>Add document</span>
          <span style={{ color: c.muted, fontSize: "12px" }}>PDF, JPG, PNG · max 10 MB</span>
        </div>
      ) : (
        <>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Upload style={{ color: c.green, width: "18px", height: "18px" }} />
          </div>
          <p style={{ color: c.primary, fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>Click to upload or drag & drop</p>
          <p style={{ color: c.muted, fontSize: "12px" }}>PDF, JPG, PNG · up to 10 MB</p>
        </>
      )}
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => tryFile(e.target.files?.[0])} style={{ display: "none" }} />
    </div>
  );
}

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    company_name: "", trade_license_number: "",
    country: "UAE", city: "", website: "", description: "",
  });

  // Primary document (required)
  const [primaryDoc, setPrimaryDoc]   = useState<UploadFile | null>(null);
  // Additional documents (optional, up to 4)
  const [extraDocs, setExtraDocs]     = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function acceptExtraDoc(file: File) {
    if (extraDocs.length >= 4) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024) return;
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    setExtraDocs((prev) => [...prev, { file, preview }]);
  }

  function removeExtra(i: number) {
    setExtraDocs((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function uploadDoc(supabase: ReturnType<typeof createClient>, userId: string, file: File, filename: string) {
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${userId}/${filename}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("verification-docs")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) return null;
    const { data } = await supabase.storage.from("verification-docs").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    return data?.signedUrl ?? null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!primaryDoc) { setError("Please upload your primary business registration document."); return; }
    setLoading(true); setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Upload primary doc
    setUploadProgress(15);
    const primaryUrl = await uploadDoc(supabase, user.id, primaryDoc.file, "business-registration");
    if (!primaryUrl) {
      setError("Primary document upload failed. Please try again.");
      setLoading(false); setUploadProgress(0); return;
    }
    setUploadProgress(50);

    // Upload extra docs
    const extraUrls: string[] = [];
    for (let i = 0; i < extraDocs.length; i++) {
      const url = await uploadDoc(supabase, user.id, extraDocs[i].file, `supporting-doc-${i + 1}`);
      if (url) extraUrls.push(url);
      setUploadProgress(50 + Math.round(((i + 1) / extraDocs.length) * 30));
    }
    setUploadProgress(85);

    // Insert seller profile
    const { error: dbErr } = await supabase.from("seller_profiles").insert({
      id: user.id,
      ...form,
      trade_license_url: primaryUrl,
      document_urls: extraUrls,
      status: "pending",
    });

    if (dbErr) {
      setError(dbErr.message);
      setLoading(false); setUploadProgress(0); return;
    }

    setUploadProgress(100);
    setTimeout(() => setSubmitted(true), 400);
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: c.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle style={{ color: c.green, width: "32px", height: "32px" }} />
          </div>
          <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, marginBottom: "10px", letterSpacing: "-0.4px" }}>
            Application submitted
          </h1>
          <p style={{ color: c.muted, fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
            Our compliance team will review your documents within 1–2 business days.
            You&apos;ll receive an email once verified and can start listing.
          </p>
          <button
            onClick={() => router.push("/seller/dashboard")}
            style={{ backgroundColor: c.primary, color: "#fff", border: "none", borderRadius: "8px", padding: "10px 28px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  const hint = docExamples[form.country] ?? docExamples["Other"];

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: c.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "540px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: c.greenBg, color: c.greenText, fontSize: "11px", fontWeight: 700, padding: "5px 12px", borderRadius: "20px", marginBottom: "16px" }}>
            <Shield style={{ width: "12px", height: "12px" }} />
            Exporter verification
          </div>
          <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>
            Set up your exporter profile
          </h1>
          <p style={{ color: c.muted, fontSize: "14px" }}>
            Required before your listings go live. Takes about 2 minutes.
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "28px" }}>

          <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>
            Company information
          </p>
          <p style={{ color: c.muted, fontSize: "13px", marginBottom: "24px" }}>
            We verify every exporter. Details must match your official business documents.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ backgroundColor: c.errorBg, border: `1px solid ${c.error}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <AlertTriangle style={{ color: c.error, width: "15px", height: "15px", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: c.error, fontSize: "13px", margin: 0 }}>{error}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Company name */}
              <div>
                <label style={labelStyle}>Company name <span style={{ color: c.error }}>*</span></label>
                <input placeholder="e.g. Apex Motors Ltd" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} required style={fieldStyle} />
              </div>

              {/* Country */}
              <div>
                <label style={labelStyle}>Country of registration <span style={{ color: c.error }}>*</span></label>
                <select value={form.country} onChange={(e) => update("country", e.target.value)} required style={{ ...fieldStyle, paddingRight: "32px" }}>
                  {exporterCountries.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                </select>
              </div>

              {/* City */}
              <div>
                <label style={labelStyle}>City <span style={{ color: c.error }}>*</span></label>
                <input placeholder="e.g. Lagos, Dubai, Karachi" value={form.city} onChange={(e) => update("city", e.target.value)} required style={fieldStyle} />
              </div>

              {/* License number */}
              <div>
                <label style={labelStyle}>Business / Trade license number <span style={{ color: c.error }}>*</span></label>
                <input placeholder="e.g. RC-1234567" value={form.trade_license_number} onChange={(e) => update("trade_license_number", e.target.value)} required style={fieldStyle} />
                <p style={{ color: c.muted, fontSize: "11px", marginTop: "5px" }}>
                  Issued by your national trade or business registration authority.
                </p>
              </div>

              {/* Website */}
              <div>
                <label style={labelStyle}>Website <span style={{ color: c.muted, fontWeight: 400 }}>(optional)</span></label>
                <input type="url" placeholder="https://yourcompany.com" value={form.website} onChange={(e) => update("website", e.target.value)} style={fieldStyle} />
              </div>

              {/* About */}
              <div>
                <label style={labelStyle}>About your company <span style={{ color: c.error }}>*</span></label>
                <textarea
                  placeholder="Describe your company, specialties, brands you deal in, and export experience…"
                  rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} required
                  style={{ ...fieldStyle, height: "auto", padding: "10px 12px", resize: "vertical" }}
                />
              </div>

              {/* ── Primary document (required) ──────────────────────────── */}
              <div>
                <label style={labelStyle}>
                  Primary registration document <span style={{ color: c.error }}>*</span>
                </label>
                <p style={{ color: c.muted, fontSize: "11px", marginBottom: "10px" }}>
                  {hint} — PDF, JPG, or PNG · Max 10 MB
                </p>
                {!primaryDoc ? (
                  <DropZone onFile={(f) => {
                    const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
                    setPrimaryDoc({ file: f, preview });
                  }} />
                ) : (
                  <FileCard uf={primaryDoc} label="Primary document · Ready to upload" onRemove={() => setPrimaryDoc(null)} />
                )}
              </div>

              {/* ── Additional documents (optional) ─────────────────────── */}
              <div>
                <label style={labelStyle}>
                  Additional documents <span style={{ color: c.muted, fontWeight: 400 }}>(optional — up to 4)</span>
                </label>
                <p style={{ color: c.muted, fontSize: "11px", marginBottom: "10px" }}>
                  Certificate of incorporation, tax registration, proof of address, VAT certificate, etc. Upload as many as apply.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {extraDocs.map((uf, i) => (
                    <FileCard key={i} uf={uf} label={`Supporting document ${i + 1}`} onRemove={() => removeExtra(i)} />
                  ))}
                  {extraDocs.length < 4 && (
                    <DropZone onFile={acceptExtraDoc} compact />
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {loading && uploadProgress > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: c.muted, fontSize: "12px" }}>
                      {uploadProgress < 50 ? "Uploading primary document…" : uploadProgress < 80 ? "Uploading supporting documents…" : uploadProgress < 90 ? "Saving profile…" : "Almost done…"}
                    </span>
                    <span style={{ color: c.muted, fontSize: "12px" }}>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: c.border, borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${uploadProgress}%`, backgroundColor: c.green, borderRadius: "2px", transition: "width 0.3s ease" }} />
                  </div>
                </div>
              )}

              {/* Privacy notice */}
              <div style={{ backgroundColor: c.amberBg, border: `1px solid #FDE68A`, borderRadius: "8px", padding: "12px 14px", display: "flex", gap: "10px" }}>
                <Shield style={{ color: c.amber, width: "15px", height: "15px", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: "#92400E", fontSize: "12px", lineHeight: "1.5", margin: 0 }}>
                  All documents are stored securely and only accessible to Fuselage compliance staff. They will not be shared with buyers.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", height: "46px",
                  backgroundColor: loading ? c.muted : c.primary,
                  color: "#fff", border: "none", borderRadius: "8px",
                  fontSize: "15px", fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Submitting…" : "Submit for verification"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
