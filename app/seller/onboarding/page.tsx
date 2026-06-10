"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Shield, CheckCircle, Upload, X, FileText, ImageIcon, AlertTriangle
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

const cities = ["Dubai", "Sharjah", "Abu Dhabi", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

type UploadFile = { file: File; preview?: string };

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    company_name: "", trade_license_number: "",
    city: "Dubai", website: "", description: "",
  });
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) acceptFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
  }

  function acceptFile(file: File) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a PDF, JPG, or PNG file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB.");
      return;
    }
    setError("");
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    setUploadFile({ file, preview });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile) { setError("Please upload your UAE trade license document."); return; }
    setLoading(true); setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Upload document to storage
    setUploadProgress(20);
    const ext = uploadFile.file.name.split(".").pop() ?? "pdf";
    const path = `${user.id}/trade-license.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("verification-docs")
      .upload(path, uploadFile.file, { upsert: true, contentType: uploadFile.file.type });

    if (uploadErr) {
      setError(`Upload failed: ${uploadErr.message}`);
      setLoading(false); setUploadProgress(0); return;
    }
    setUploadProgress(70);

    // Get a signed URL (valid 10 years) to store as reference
    const { data: signedData } = await supabase.storage
      .from("verification-docs")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);

    setUploadProgress(85);

    // Insert seller profile
    const { error: dbErr } = await supabase.from("seller_profiles").insert({
      id: user.id,
      ...form,
      trade_license_url: signedData?.signedUrl ?? null,
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
            Our team will review your trade license and company details within 1–2 business days.
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

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: c.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

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
            Required before your listings go live. Takes 2 minutes.
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "28px" }}>

          {/* Section label */}
          <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>
            Company information
          </p>
          <p style={{ color: c.muted, fontSize: "13px", marginBottom: "24px" }}>
            We verify every exporter. Ensure these match your official trade license.
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
                <input
                  placeholder="Al Rashidi Motors LLC"
                  value={form.company_name}
                  onChange={(e) => update("company_name", e.target.value)}
                  required
                  style={fieldStyle}
                />
              </div>

              {/* Trade license number */}
              <div>
                <label style={labelStyle}>UAE Trade license number <span style={{ color: c.error }}>*</span></label>
                <input
                  placeholder="DED-123456"
                  value={form.trade_license_number}
                  onChange={(e) => update("trade_license_number", e.target.value)}
                  required
                  style={fieldStyle}
                />
                <p style={{ color: c.muted, fontSize: "11px", marginTop: "5px" }}>
                  Issued by DED, Sharjah Economic Department, or equivalent UAE authority.
                </p>
              </div>

              {/* City */}
              <div>
                <label style={labelStyle}>City <span style={{ color: c.error }}>*</span></label>
                <select
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  required
                  style={{ ...fieldStyle, paddingRight: "32px" }}
                >
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Website */}
              <div>
                <label style={labelStyle}>Website <span style={{ color: c.muted, fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="url"
                  placeholder="https://alrashidimotors.ae"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  style={fieldStyle}
                />
              </div>

              {/* About */}
              <div>
                <label style={labelStyle}>About your company <span style={{ color: c.error }}>*</span></label>
                <textarea
                  placeholder="Describe your company, specialties, brands you deal in, and export experience…"
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  required
                  style={{ ...fieldStyle, height: "auto", padding: "10px 12px", resize: "vertical" }}
                />
              </div>

              {/* ── Document upload ─────────────────────────────────────── */}
              <div>
                <label style={labelStyle}>
                  Trade license document <span style={{ color: c.error }}>*</span>
                </label>
                <p style={{ color: c.muted, fontSize: "11px", marginBottom: "10px" }}>
                  Upload a clear copy of your UAE trade license. PDF, JPG, or PNG · Max 10 MB
                </p>

                {!uploadFile ? (
                  /* Drop zone */
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${c.border}`,
                      borderRadius: "10px",
                      padding: "28px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: c.bg,
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.green)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = c.border)}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Upload style={{ color: c.green, width: "18px", height: "18px" }} />
                    </div>
                    <p style={{ color: c.primary, fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                      Click to upload or drag & drop
                    </p>
                    <p style={{ color: c.muted, fontSize: "12px" }}>PDF, JPG, PNG · up to 10 MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileInput}
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  /* File preview */
                  <div style={{ border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
                    {uploadFile.preview ? (
                      /* Image preview */
                      <div style={{ position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadFile.preview}
                          alt="Trade license preview"
                          style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }}
                        />
                        <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                          <button
                            type="button"
                            onClick={() => { setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                            style={{ backgroundColor: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          >
                            <X style={{ color: "#fff", width: "14px", height: "14px" }} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* PDF row */
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ backgroundColor: c.errorBg, width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FileText style={{ color: c.error, width: "18px", height: "18px" }} />
                          </div>
                          <div>
                            <p style={{ color: c.primary, fontSize: "13px", fontWeight: 600 }}>{uploadFile.file.name}</p>
                            <p style={{ color: c.muted, fontSize: "11px" }}>{(uploadFile.file.size / 1024).toFixed(0)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: c.muted, display: "flex" }}
                        >
                          <X style={{ width: "16px", height: "16px" }} />
                        </button>
                      </div>
                    )}
                    {/* File name footer */}
                    <div style={{ borderTop: `1px solid ${c.border}`, padding: "10px 14px", backgroundColor: c.bg, display: "flex", alignItems: "center", gap: "8px" }}>
                      <ImageIcon style={{ color: c.green, width: "13px", height: "13px" }} />
                      <span style={{ color: c.greenText, fontSize: "12px", fontWeight: 600 }}>Ready to upload</span>
                      <span style={{ color: c.muted, fontSize: "12px", marginLeft: "auto" }}>
                        {(uploadFile.file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload progress bar */}
              {loading && uploadProgress > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: c.muted, fontSize: "12px" }}>
                      {uploadProgress < 70 ? "Uploading document…" : uploadProgress < 90 ? "Saving profile…" : "Almost done…"}
                    </span>
                    <span style={{ color: c.muted, fontSize: "12px" }}>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: c.border, borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${uploadProgress}%`, backgroundColor: c.green, borderRadius: "2px", transition: "width 0.3s ease" }} />
                  </div>
                </div>
              )}

              {/* Notice */}
              <div style={{ backgroundColor: c.amberBg, border: `1px solid #FDE68A`, borderRadius: "8px", padding: "12px 14px", display: "flex", gap: "10px" }}>
                <Shield style={{ color: c.amber, width: "15px", height: "15px", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: "#92400E", fontSize: "12px", lineHeight: "1.5", margin: 0 }}>
                  Your document is stored securely and only accessible to Fuselage compliance staff. It will not be shared with buyers.
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
