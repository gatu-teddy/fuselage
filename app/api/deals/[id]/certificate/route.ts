/**
 * GET /api/deals/[id]/certificate
 *
 * Generates and streams a Fuselage Deal Certificate PDF for a completed deal.
 * Only the buyer or seller on the deal may download it.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ─── Colour palette (Trust Blue + Safety Green) ───────────────────────────
const NAVY  = rgb(0.059, 0.090, 0.165);  // #0F172A
const GREEN = rgb(0.063, 0.725, 0.506);  // #10B981
const GREY  = rgb(0.392, 0.455, 0.545);  // #647386
const LIGHT = rgb(0.969, 0.980, 0.988);  // #F8FAFC
const WHITE = rgb(1, 1, 1);

function fmt(v: unknown): string {
  if (v == null) return "—";
  return String(v);
}
function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function fmtUSD(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch deal — only buyer or seller can access
  const { data: deal } = await supabase
    .from("deals")
    .select(`
      *,
      listing:listings(make, model, year, chassis_number, color, engine_size),
      buyer:profiles!deals_buyer_id_fkey(full_name, email, country),
      seller:seller_profiles(company_name, city, country, trade_license_number,
        profile:profiles(full_name, email))
    `)
    .eq("id", id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single();

  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  if (deal.status !== "completed") {
    return NextResponse.json({ error: "Certificate only available for completed deals" }, { status: 400 });
  }

  // ── Build PDF ────────────────────────────────────────────────────────────
  const pdfDoc  = await PDFDocument.create();
  const page    = pdfDoc.addPage([595, 842]); // A4 portrait
  const { width, height } = page.getSize();

  const bold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const reg    = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const obliq  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const listing = deal.listing as { make: string; model: string; year: number; chassis_number?: string; color?: string; engine_size?: string };
  const buyer   = deal.buyer   as { full_name: string; email: string; country: string };
  const seller  = deal.seller  as { company_name: string; city: string; country: string; trade_license_number: string; profile: { full_name: string; email: string } };

  // ── Navy header bar ───────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 100, width, height: 100, color: NAVY });

  // Wordmark
  page.drawText("FUSELAGE", { x: 40, y: height - 44, size: 22, font: bold, color: WHITE });
  page.drawText("Global Vehicle Trade Platform", { x: 40, y: height - 62, size: 9, font: reg, color: GREEN });

  // Certificate label (top right)
  page.drawText("DEAL CERTIFICATE", { x: width - 200, y: height - 44, size: 13, font: bold, color: GREEN });
  page.drawText("Fuselage Verified", { x: width - 167, y: height - 62, size: 9, font: reg, color: WHITE });

  // ── Green accent line ─────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 104, width, height: 4, color: GREEN });

  // ── Certificate heading ───────────────────────────────────────────────────
  const vehicleLine = `${listing?.year ?? ""} ${listing?.make ?? ""} ${listing?.model ?? ""}`.trim();
  page.drawText("CERTIFICATE OF COMPLETED DEAL", { x: 40, y: height - 148, size: 16, font: bold, color: NAVY });
  page.drawText(vehicleLine, { x: 40, y: height - 170, size: 12, font: obliq, color: GREY });

  // Certificate ID + date row
  page.drawText(`Certificate No.  ${id.toUpperCase().slice(0, 8)}`, { x: 40, y: height - 195, size: 9, font: reg, color: GREY });
  page.drawText(`Issued  ${fmtDate(deal.updated_at)}`, { x: 300, y: height - 195, size: 9, font: reg, color: GREY });

  // Divider
  page.drawLine({ start: { x: 40, y: height - 208 }, end: { x: width - 40, y: height - 208 }, thickness: 0.5, color: rgb(0.878, 0.910, 0.941) });

  // ── Section helper ────────────────────────────────────────────────────────
  function section(title: string, y: number) {
    page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 22, color: LIGHT });
    page.drawText(title, { x: 46, y, size: 9, font: bold, color: NAVY });
    page.drawRectangle({ x: 40, y: y - 5, width: 3, height: 22, color: GREEN });
  }

  function row(label: string, value: string, y: number, labelX = 46, valueX = 220) {
    page.drawText(label, { x: labelX, y, size: 9, font: reg, color: GREY });
    page.drawText(value, { x: valueX, y, size: 9, font: bold, color: NAVY });
  }

  // ── Vehicle details ───────────────────────────────────────────────────────
  let y = height - 236;
  section("VEHICLE", y); y -= 26;
  row("Make / Model",    `${fmt(listing?.make)} ${fmt(listing?.model)}`, y); y -= 16;
  row("Year",            fmt(listing?.year), y); y -= 16;
  row("Colour",          fmt(listing?.color), y); y -= 16;
  row("Engine Size",     fmt(listing?.engine_size), y); y -= 16;
  row("Chassis / VIN",   fmt(listing?.chassis_number), y); y -= 24;

  // ── Deal details ──────────────────────────────────────────────────────────
  section("DEAL", y); y -= 26;
  row("Deal Reference",    id.toUpperCase().slice(0, 8), y, 46, 220); y -= 16;
  row("Agreed Price",      fmtUSD(deal.agreed_price_usd), y, 46, 220); y -= 16;
  row("Destination",       fmt(deal.destination_country), y, 46, 220); y -= 16;
  row("Port",              fmt(deal.destination_port), y, 46, 220); y -= 16;
  row("Status",            "COMPLETED", y, 46, 220); y -= 16;
  row("Completed Date",    fmtDate(deal.updated_at), y, 46, 220); y -= 24;

  // ── Parties (two-column) ──────────────────────────────────────────────────
  section("PARTIES", y); y -= 26;
  const MID = width / 2 + 10;

  page.drawText("BUYER", { x: 46, y, size: 8, font: bold, color: GREEN });
  page.drawText("VERIFIED EXPORTER", { x: MID, y, size: 8, font: bold, color: GREEN });
  y -= 14;

  page.drawText(fmt(buyer?.full_name), { x: 46, y, size: 9, font: bold, color: NAVY });
  page.drawText(fmt(seller?.company_name), { x: MID, y, size: 9, font: bold, color: NAVY });
  y -= 13;

  page.drawText(fmt(buyer?.country), { x: 46, y, size: 8, font: reg, color: GREY });
  page.drawText(`${fmt(seller?.city)}, ${fmt(seller?.country)}`, { x: MID, y, size: 8, font: reg, color: GREY });
  y -= 13;

  page.drawText(fmt(buyer?.email), { x: 46, y, size: 8, font: reg, color: GREY });
  page.drawText(`Licence: ${fmt(seller?.trade_license_number)}`, { x: MID, y, size: 8, font: reg, color: GREY });
  y -= 28;

  // ── Trust notice box ──────────────────────────────────────────────────────
  const boxH = 72;
  page.drawRectangle({ x: 40, y: y - boxH + 16, width: width - 80, height: boxH, color: LIGHT, borderColor: GREEN, borderWidth: 0.5 });
  page.drawText("FUSELAGE TRUST CERTIFICATION", { x: 52, y: y, size: 8, font: bold, color: GREEN });

  const notice = [
    "This certificate confirms that the above vehicle transaction was facilitated through Fuselage, a verified",
    "global vehicle trade platform. Both the buyer and exporter have been vetted and verified by Fuselage.",
    "All deal documents and payment records are held in Fuselage's secure document registry for 7 years",
    "in compliance with applicable data protection and trade regulations.",
  ];
  notice.forEach((line, i) => {
    page.drawText(line, { x: 52, y: y - 14 - i * 11, size: 7.5, font: reg, color: GREY });
  });

  y -= boxH + 14;

  // ── Signature area ────────────────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y }, end: { x: 220, y }, thickness: 0.5, color: GREY });
  page.drawLine({ start: { x: 260, y }, end: { x: 440, y }, thickness: 0.5, color: GREY });
  page.drawText("Buyer signature", { x: 40, y: y - 14, size: 8, font: reg, color: GREY });
  page.drawText("Exporter representative", { x: 260, y: y - 14, size: 8, font: reg, color: GREY });

  // ── Footer ────────────────────────────────────────────────────────────────
  page.drawLine({ start: { x: 0, y: 40 }, end: { x: width, y: 40 }, thickness: 0.5, color: GREEN });
  page.drawText("Fuselage · fuselage.app · Verified Global Vehicle Trade", { x: 40, y: 24, size: 7.5, font: reg, color: GREY });
  page.drawText(`Document ID: ${id}`, { x: width - 220, y: 24, size: 7.5, font: reg, color: GREY });

  // ── Serialize ────────────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  const filename = `fuselage-deal-${id.slice(0, 8)}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length":      pdfBytes.length.toString(),
    },
  });
}
