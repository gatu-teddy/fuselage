/**
 * POST /api/verify/vin
 *
 * Validates a chassis/VIN number and stores a verification record.
 *
 * Body: { chassis_number: string; listing_id?: string }
 *
 * Validation layers:
 *   1. Format check — length + character set (JDM chassis accept alphanumeric)
 *   2. NHTSA decode — free US/global VIN API (17-char ISO VINs only)
 *   3. JDM chassis heuristic — Japanese domestic market format (e.g. JZX100-123456)
 *
 * Response:
 *   { id, chassis_number, result, decoded?, format }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ── VIN / chassis format detectors ───────────────────────────────────────────

/** Standard 17-char ISO 3779 VIN */
function isIsoVin(s: string) {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(s);
}

/**
 * JDM (Japanese Domestic Market) chassis format.
 * e.g. JZX100-0123456, R34-000001, BNR32-200001
 * Pattern: 2–6 alpha/num model code, hyphen, 6–7 digits
 */
function isJdmChassis(s: string) {
  return /^[A-Z0-9]{2,8}-\d{5,7}$/i.test(s);
}

/** Loose format: alphanumeric, 6–20 chars, hyphens allowed */
function isLooseValid(s: string) {
  return /^[A-Z0-9\-]{6,20}$/i.test(s);
}

// ── NHTSA free VIN decode (17-char VINs only) ─────────────────────────────────
async function nhtsaDecode(vin: string): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`,
      { next: { revalidate: 86400 } }   // cache 24h — same VIN won't re-hit NHTSA
    );
    if (!res.ok) return null;
    const json = await res.json();
    const results: { Variable: string; Value: string }[] = json?.Results ?? [];

    // Pick the useful fields
    const FIELDS = ["Make", "Model", "Model Year", "Vehicle Type", "Plant Country", "Body Class"];
    const decoded: Record<string, string> = {};
    for (const r of results) {
      if (FIELDS.includes(r.Variable) && r.Value && r.Value !== "Not Applicable") {
        decoded[r.Variable] = r.Value;
      }
    }
    return Object.keys(decoded).length > 0 ? decoded : null;
  } catch {
    return null;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const raw: string = (body.chassis_number ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const listingId: string | null = body.listing_id ?? null;

  if (!raw) {
    return NextResponse.json({ error: "chassis_number is required" }, { status: 400 });
  }

  // ── Format detection ────────────────────────────────────────────────────────
  let format: "iso_vin" | "jdm" | "other" | "invalid" = "invalid";
  let result: "valid" | "flagged" | "not_found" | "pending" = "pending";
  let decoded: Record<string, string> | null = null;

  if (isIsoVin(raw)) {
    format = "iso_vin";
    decoded = await nhtsaDecode(raw);
    result  = decoded ? "valid" : "pending";   // pending = no NHTSA data but format OK
  } else if (isJdmChassis(raw)) {
    format = "jdm";
    // JDM chassis can't be decoded via NHTSA — flag for manual admin review
    result = "pending";
  } else if (isLooseValid(raw)) {
    format = "other";
    result = "pending";
  } else {
    format  = "invalid";
    result  = "flagged";
  }

  // ── Persist verification request ────────────────────────────────────────────
  const { data: record, error: dbErr } = await supabase
    .from("vin_verifications")
    .insert({
      chassis_number: raw,
      listing_id:     listingId,
      requested_by:   user.id,
      result,
      decoded:        decoded ?? undefined,
    })
    .select("id, chassis_number, result, decoded, created_at")
    .single();

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({
    id:             record.id,
    chassis_number: record.chassis_number,
    format,
    result:         record.result,
    decoded:        record.decoded ?? null,
    message:        format === "invalid"
      ? "Chassis number format is not recognised. Please check and resubmit."
      : result === "valid"
      ? "Chassis number validated successfully."
      : "Chassis number format is accepted and queued for manual verification.",
  });
}
