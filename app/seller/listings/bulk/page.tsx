"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Upload, Download, CheckCircle, AlertTriangle, X, FileText } from "lucide-react";

const c = {
  primary: "#0F172A", green: "#10B981", greenBg: "#D1FAE5", greenText: "#065F46",
  bg: "#F8FAFC", bgDim: "#F1F5F9", surface: "#FFFFFF", border: "#E2E8F0",
  muted: "#64748B", body: "#334155", error: "#EF4444", errorBg: "#FEF2F2",
  amber: "#F59E0B", amberBg: "#FEF3C7",
};

// ─── CSV template columns (order matters — matches parse logic below) ──────────
const COLUMNS = [
  { key: "make",              label: "Make",              example: "Toyota",          required: true  },
  { key: "model",             label: "Model",             example: "Land Cruiser",    required: true  },
  { key: "year",              label: "Year",              example: "2023",            required: true  },
  { key: "type",              label: "Type",              example: "car",             required: true,  note: "car or bike" },
  { key: "steering",          label: "Steering",          example: "RHD",            required: true,  note: "RHD or LHD" },
  { key: "price_usd",         label: "Price USD (FOB)",  example: "42000",           required: true  },
  { key: "mileage_km",        label: "Mileage (km)",     example: "18000",           required: false },
  { key: "color",             label: "Colour",            example: "Pearl White",     required: false },
  { key: "engine_size",       label: "Engine size",      example: "4.0L V6",         required: false },
  { key: "chassis_number",    label: "Chassis / VIN",    example: "JTMHX3J1X00123456", required: false },
  { key: "availability",      label: "Availability",     example: "in_stock",        required: false, note: "in_stock | en_route | pre_order" },
  { key: "description",       label: "Description",      example: "Full service history, GCC spec", required: false },
  { key: "features",          label: "Features",         example: "Sunroof,Leather,360 Camera",     required: false, note: "comma-separated inside the cell" },
];

type ParsedRow = {
  row: number;
  data: Record<string, string>;
  errors: string[];
  valid: boolean;
};

type ImportResult = { succeeded: number; errors: { row: number; msg: string }[] };

function generateCSV(): string {
  const header = COLUMNS.map(c => c.label).join(",");
  const example = COLUMNS.map(c => `"${c.example}"`).join(",");
  return [header, example].join("\n");
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];

  // Parse header to find column indices
  const rawHeader = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
  const colMap: Record<string, number> = {};
  COLUMNS.forEach(col => {
    const idx = rawHeader.findIndex(h => h === col.label.toLowerCase());
    if (idx >= 0) colMap[col.key] = idx;
  });

  return lines.slice(1).map((line, i) => {
    // Respect quoted fields containing commas
    const cells: string[] = [];
    let cur = "", inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { cells.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    cells.push(cur.trim());

    const data: Record<string, string> = {};
    COLUMNS.forEach(col => {
      const idx = colMap[col.key] ?? -1;
      data[col.key] = idx >= 0 ? (cells[idx] ?? "").replace(/^"|"$/g, "").trim() : "";
    });

    const errors: string[] = [];
    COLUMNS.filter(c => c.required).forEach(col => {
      if (!data[col.key]) errors.push(`${col.label} is required`);
    });
    if (data.year && (isNaN(Number(data.year)) || Number(data.year) < 1990 || Number(data.year) > 2030))
      errors.push("Year must be between 1990 and 2030");
    if (data.price_usd && isNaN(Number(data.price_usd)))
      errors.push("Price must be a number");
    if (data.steering && !["RHD", "LHD"].includes(data.steering.toUpperCase()))
      errors.push('Steering must be RHD or LHD');
    if (data.type && !["car", "bike"].includes(data.type.toLowerCase()))
      errors.push('Type must be car or bike');
    if (data.availability && !["in_stock", "en_route", "pre_order"].includes(data.availability))
      errors.push('Availability must be in_stock, en_route, or pre_order');

    return { row: i + 2, data, errors, valid: errors.length === 0 };
  });
}

export default function BulkUploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows]           = useState<ParsedRow[]>([]);
  const [fileName, setFileName]   = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult]       = useState<ImportResult | null>(null);
  const [dragOver, setDragOver]   = useState(false);

  const loadFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) return;
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setRows(parseCSV(text));
    };
    reader.readAsText(file);
  }, []);

  function downloadTemplate() {
    const blob = new Blob([generateCSV()], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fuselage-inventory-template.csv";
    a.click();
  }

  async function handleImport() {
    const valid = rows.filter(r => r.valid);
    if (valid.length === 0) return;
    setImporting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: sp } = await supabase.from("seller_profiles").select("destination_ports").eq("id", user.id).single();

    let succeeded = 0;
    const failed: { row: number; msg: string }[] = [];

    for (const row of valid) {
      const { data: d } = row;
      const { error } = await supabase.from("listings").insert({
        seller_id:        user.id,
        type:             d.type.toLowerCase() || "car",
        make:             d.make,
        model:            d.model,
        year:             parseInt(d.year),
        steering:         d.steering.toUpperCase() || "RHD",
        price_usd:        parseFloat(d.price_usd),
        mileage_km:       d.mileage_km ? parseInt(d.mileage_km) : 0,
        color:            d.color || null,
        engine_size:      d.engine_size || null,
        chassis_number:   d.chassis_number || null,
        availability:     d.availability || "in_stock",
        description:      d.description || null,
        features:         d.features ? d.features.split(",").map((f: string) => f.trim()).filter(Boolean) : [],
        destination_ports: sp?.destination_ports ?? [],
        status:           "active",
      });
      if (error) { failed.push({ row: row.row, msg: error.message }); }
      else { succeeded++; }
    }

    setResult({ succeeded, errors: failed });
    setImporting(false);
  }

  const validCount   = rows.filter(r => r.valid).length;
  const invalidCount = rows.filter(r => !r.valid).length;

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 style={{ color: c.primary, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Bulk import inventory</h1>
        <p style={{ color: c.muted, fontSize: "14px", marginTop: "4px" }}>Upload a CSV to add multiple vehicles at once. Images can be added individually afterwards.</p>
      </div>

      {/* Step 1: download template */}
      <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px 24px", marginBottom: "20px" }}>
        <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>Step 1 — Download the template</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ color: c.body, fontSize: "14px" }}>
            Fill in the CSV template — one row per vehicle. Required columns are marked with *.
          </p>
          <button
            onClick={downloadTemplate}
            style={{ display: "flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 20px", backgroundColor: c.primary, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          >
            <Download style={{ width: "14px", height: "14px" }} /> Download template
          </button>
        </div>

        {/* Column reference */}
        <div style={{ marginTop: "16px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: c.bgDim }}>
                <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Column</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Required</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Example</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {COLUMNS.map((col, i) => (
                <tr key={col.key} style={{ borderTop: `1px solid ${c.border}`, backgroundColor: i % 2 === 0 ? c.surface : c.bg }}>
                  <td style={{ padding: "8px 12px", color: c.primary, fontWeight: 600 }}>{col.label}</td>
                  <td style={{ padding: "8px 12px" }}>
                    {col.required
                      ? <span style={{ color: c.green, fontWeight: 700 }}>Yes</span>
                      : <span style={{ color: c.muted }}>No</span>}
                  </td>
                  <td style={{ padding: "8px 12px", fontFamily: "monospace", color: c.body }}>{col.example}</td>
                  <td style={{ padding: "8px 12px", color: c.muted }}>{col.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 2: upload */}
      <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px 24px", marginBottom: "20px" }}>
        <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>Step 2 — Upload your CSV</p>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? c.green : c.border}`, borderRadius: "10px",
            padding: "32px 20px", textAlign: "center", cursor: "pointer",
            backgroundColor: dragOver ? c.greenBg : c.bg, transition: "all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = c.green)}
          onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = c.border; }}
        >
          {fileName ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <FileText style={{ color: c.green, width: "20px", height: "20px" }} />
              <span style={{ color: c.primary, fontWeight: 600, fontSize: "14px" }}>{fileName}</span>
              <button type="button" onClick={e => { e.stopPropagation(); setFileName(""); setRows([]); setResult(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: c.muted, display: "flex" }}>
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
          ) : (
            <>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Upload style={{ color: c.green, width: "20px", height: "20px" }} />
              </div>
              <p style={{ color: c.primary, fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>Click to upload or drag & drop your CSV</p>
              <p style={{ color: c.muted, fontSize: "12px" }}>CSV files only</p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".csv" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} style={{ display: "none" }} />
        </div>
      </div>

      {/* Preview */}
      {rows.length > 0 && !result && (
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px 24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Step 3 — Review & import</p>
              <div style={{ display: "flex", gap: "16px" }}>
                <span style={{ color: c.green, fontSize: "14px", fontWeight: 700 }}>{validCount} ready to import</span>
                {invalidCount > 0 && <span style={{ color: c.error, fontSize: "14px", fontWeight: 700 }}>{invalidCount} rows have errors</span>}
              </div>
            </div>
            <button
              onClick={handleImport}
              disabled={validCount === 0 || importing}
              style={{ height: "42px", padding: "0 24px", backgroundColor: validCount === 0 || importing ? c.muted : c.primary, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: validCount === 0 || importing ? "not-allowed" : "pointer" }}
            >
              {importing ? "Importing…" : `Import ${validCount} vehicle${validCount !== 1 ? "s" : ""}`}
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: c.bgDim }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Row</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Make</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Model</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Year</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Steering</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Price (USD)</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: c.muted, fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.row} style={{ borderTop: `1px solid ${c.border}`, backgroundColor: row.valid ? c.surface : c.errorBg }}>
                    <td style={{ padding: "8px 12px", color: c.muted }}>{row.row}</td>
                    <td style={{ padding: "8px 12px", color: c.primary, fontWeight: 500 }}>{row.data.make || "—"}</td>
                    <td style={{ padding: "8px 12px", color: c.primary }}>{row.data.model || "—"}</td>
                    <td style={{ padding: "8px 12px", color: c.primary }}>{row.data.year || "—"}</td>
                    <td style={{ padding: "8px 12px", color: c.primary }}>{row.data.steering || "—"}</td>
                    <td style={{ padding: "8px 12px", color: c.primary }}>{row.data.price_usd ? `$${Number(row.data.price_usd).toLocaleString()}` : "—"}</td>
                    <td style={{ padding: "8px 12px" }}>
                      {row.valid ? (
                        <span style={{ color: c.green, fontWeight: 700, fontSize: "11px" }}>✓ Ready</span>
                      ) : (
                        <span title={row.errors.join(" · ")} style={{ color: c.error, fontWeight: 700, fontSize: "11px", cursor: "help" }}>
                          ✕ {row.errors[0]}{row.errors.length > 1 ? ` +${row.errors.length - 1}` : ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ backgroundColor: result.succeeded > 0 ? c.greenBg : c.errorBg, border: `1px solid ${result.succeeded > 0 ? c.green : c.error}40`, borderRadius: "10px", padding: "20px 24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            {result.succeeded > 0
              ? <CheckCircle style={{ color: c.green, width: "20px", height: "20px", flexShrink: 0, marginTop: "2px" }} />
              : <AlertTriangle style={{ color: c.error, width: "20px", height: "20px", flexShrink: 0, marginTop: "2px" }} />}
            <div>
              <p style={{ color: c.primary, fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>
                {result.succeeded > 0 ? `${result.succeeded} vehicle${result.succeeded !== 1 ? "s" : ""} imported successfully` : "Import failed"}
              </p>
              {result.errors.length > 0 && (
                <ul style={{ color: c.error, fontSize: "13px", marginTop: "8px", paddingLeft: "16px" }}>
                  {result.errors.map(e => <li key={e.row}>Row {e.row}: {e.msg}</li>)}
                </ul>
              )}
              {result.succeeded > 0 && (
                <button onClick={() => router.push("/seller/listings")} style={{ marginTop: "12px", height: "38px", padding: "0 20px", backgroundColor: c.primary, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  View listings →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <button onClick={() => router.back()} style={{ color: c.muted, fontSize: "13px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        ← Back
      </button>
    </div>
  );
}
