"use client";

import { useState } from "react";
import { c } from "@/lib/tokens";
import { Calculator, Loader2, Ship, Package, Receipt, TrendingDown } from "lucide-react";

const MAKES = [
  "Honda Super Cub C100 / C110",
  "Honda Wave 110 / 125",
  "Honda CB125F",
  "Yamaha YBR 125",
  "Yamaha Crux Rev 110",
  "Suzuki GN125",
  "Suzuki EN125",
  "Kawasaki ZS125",
  "Generic 110cc (Chinese brand)",
];

const DESTINATIONS = [
  "Mombasa, Kenya",
  "Dar es Salaam, Tanzania",
  "Lagos, Nigeria",
  "Tema / Accra, Ghana",
  "Nacala, Mozambique",
  "Beira, Mozambique",
  "Durban, South Africa",
  "Djibouti (for Ethiopia)",
  "Kampala, Uganda (via Mombasa)",
];

interface Estimate {
  fobPerUnit: number;
  freightPerUnit: number;
  dutyAndTaxPerUnit: number;
  portHandlingPerUnit: number;
  totalLandedPerUnit: number;
  totalLandedBatch: number;
  kshPerUnit: number;
  kshBatch: number;
  localPriceKSH: number;
  savingsPercent: number;
  batchStatus: string;
  estimatedDeparture: string;
  containerType: string;
  qualifiesForBatch: boolean;
  notes: string;
  breakdown: {
    fob: string;
    freight: string;
    importDuty: string;
    vat: string;
    otherTaxes: string;
    portHandling: string;
  };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function ShippingCalculatorSection() {
  const [bikes, setBikes] = useState<string>("1");
  const [makeModel, setMakeModel] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEstimate(null);
    setLoading(true);
    try {
      const res = await fetch("/api/shipping-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bikes: Number(bikes), makeModel, destination }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setEstimate(data as Estimate);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 14px",
    border: `1px solid ${c.border}`,
    borderRadius: "8px",
    fontSize: "14px",
    color: c.primary,
    backgroundColor: c.surface,
    outline: "none",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    color: c.body,
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
  };

  return (
    <section
      id="calculator"
      style={{ backgroundColor: c.bg, borderBottom: `1px solid ${c.border}` }}
      className="py-20"
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Free Estimate
          </p>
          <h2
            style={{ color: c.primary, letterSpacing: "-0.01em" }}
            className="text-4xl font-bold mb-3"
          >
            Shipping Cost Calculator
          </h2>
          <p style={{ color: c.muted }} className="text-lg max-w-xl mx-auto leading-relaxed">
            Get an AI-powered landed cost estimate — FOB, freight, duties, and all taxes — in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start max-w-[960px] mx-auto">
          {/* Form */}
          <div
            style={{
              backgroundColor: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <div
                style={{ backgroundColor: c.bgDim, width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <Calculator style={{ color: c.primary, width: "16px", height: "16px" }} />
              </div>
              <p style={{ color: c.primary, fontWeight: 700, fontSize: "15px" }}>Your import details</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle}>Number of bikes</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={bikes}
                  onChange={(e) => setBikes(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Make / model</label>
                <select
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  required
                >
                  <option value="">Select a bike model…</option>
                  {MAKES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Destination port</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  required
                >
                  <option value="">Select destination…</option>
                  {DESTINATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  height: "46px",
                  backgroundColor: loading ? c.muted : c.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "4px",
                  transition: "background-color 0.15s",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: "15px", height: "15px", animation: "spin 1s linear infinite" }} />
                    Calculating…
                  </>
                ) : (
                  "Get Estimate"
                )}
              </button>
            </form>

            {error && (
              <div
                style={{
                  marginTop: "16px",
                  backgroundColor: c.redBg,
                  border: `1px solid ${c.redBorder}`,
                  borderRadius: "8px",
                  padding: "12px 14px",
                  color: c.error,
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <p style={{ color: c.muted, fontSize: "11px", marginTop: "16px", lineHeight: 1.6 }}>
              Estimates are indicative. Final landed cost depends on auction price, current freight rates, and your clearing agent.
            </p>
          </div>

          {/* Results */}
          <div>
            {!estimate && !loading && (
              <div
                style={{
                  backgroundColor: c.bgDim,
                  border: `1px dashed ${c.border}`,
                  borderRadius: "12px",
                  padding: "48px 32px",
                  textAlign: "center",
                }}
              >
                <Ship style={{ color: c.muted, width: "32px", height: "32px", margin: "0 auto 12px" }} />
                <p style={{ color: c.muted, fontSize: "14px" }}>Your estimate will appear here</p>
              </div>
            )}

            {loading && (
              <div
                style={{
                  backgroundColor: c.bgDim,
                  border: `1px dashed ${c.border}`,
                  borderRadius: "12px",
                  padding: "48px 32px",
                  textAlign: "center",
                }}
              >
                <Loader2 style={{ color: c.green, width: "28px", height: "28px", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
                <p style={{ color: c.muted, fontSize: "14px" }}>Running estimate…</p>
              </div>
            )}

            {estimate && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Summary card */}
                <div
                  style={{
                    backgroundColor: c.primary,
                    borderRadius: "12px",
                    padding: "24px 28px",
                    color: "#fff",
                  }}
                >
                  <p style={{ fontSize: "12px", opacity: 0.6, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Estimated landed cost
                  </p>
                  <p style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "2px" }}>
                    ${fmt(estimate.totalLandedPerUnit)} / bike
                  </p>
                  <p style={{ fontSize: "13px", opacity: 0.65 }}>
                    KSH {fmt(estimate.kshPerUnit)} · Total batch: ${fmt(estimate.totalLandedBatch)}
                  </p>

                  {estimate.savingsPercent > 0 && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        backgroundColor: "rgba(16,185,129,0.18)",
                        color: "#6EE7B7",
                        fontSize: "12px",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "99px",
                        marginTop: "12px",
                      }}
                    >
                      <TrendingDown style={{ width: "11px", height: "11px" }} />
                      ~{estimate.savingsPercent}% cheaper than buying locally
                    </div>
                  )}
                </div>

                {/* Cost breakdown */}
                <div
                  style={{
                    backgroundColor: c.surface,
                    border: `1px solid ${c.border}`,
                    borderRadius: "12px",
                    padding: "20px 24px",
                  }}
                >
                  <p style={{ color: c.primary, fontSize: "13px", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Receipt style={{ width: "13px", height: "13px" }} /> Cost breakdown (per bike)
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {Object.entries(estimate.breakdown).map(([key, val]) => (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ color: c.muted, fontSize: "12px", textTransform: "capitalize" }}>
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span style={{ color: c.body, fontSize: "12px", fontWeight: 600, textAlign: "right", maxWidth: "58%" }}>
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batch status */}
                <div
                  style={{
                    backgroundColor: estimate.qualifiesForBatch ? c.greenBg : c.amberBg,
                    border: `1px solid ${estimate.qualifiesForBatch ? "#A7F3D0" : c.amberBorder}`,
                    borderRadius: "12px",
                    padding: "16px 20px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <Package style={{ color: estimate.qualifiesForBatch ? c.greenText : "#92400E", width: "15px", height: "15px", marginTop: "1px", flexShrink: 0 }} />
                  <div>
                    <p style={{ color: estimate.qualifiesForBatch ? c.greenText : "#92400E", fontSize: "12px", fontWeight: 700, marginBottom: "3px" }}>
                      {estimate.qualifiesForBatch
                        ? `Qualifies for ${estimate.containerType} batch · Departure ${estimate.estimatedDeparture}`
                        : `Batch: ${estimate.estimatedDeparture} · Add more bikes to qualify`}
                    </p>
                    <p style={{ color: estimate.qualifiesForBatch ? "#065F46" : "#78350F", fontSize: "12px", lineHeight: 1.5 }}>
                      {estimate.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
