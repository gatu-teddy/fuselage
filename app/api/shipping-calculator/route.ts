import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are TrueWagon's shipping cost calculator. You estimate the landed cost of importing second-hand Japanese motorbikes to African ports.

Current market data (September 2026):
JAPAN FOB PRICES (auction purchase + agent fee):
- Honda Super Cub C50/C70/C90/C100/C110: $700–1,100
- Honda Wave 110/125: $750–1,150
- Honda CB125F/Shine: $900–1,300
- Yamaha YBR 125: $850–1,200
- Yamaha Crux Rev 110: $750–1,050
- Suzuki GN125 / EN125: $800–1,150
- Kawasaki ZS125: $850–1,200
- Generic 110cc (Chinese brand): $500–800

FREIGHT RATES Japan → Africa:
- LCL (shared container, <8 bikes): $290–360 per unit
- 20ft container (8–10 bikes): $3,000–3,800 total → $300–475/unit
- 40ft container (18–22 bikes): $4,800–5,800 total → $220–320/unit
- Transit time: 28–35 days (Osaka/Kobe → East Africa)

IMPORT DUTY & TAX BY DESTINATION:
Kenya (Mombasa):
  Import Duty: 25% of CIF
  IDF Fee: 2.25% of CIF
  Railway Development Levy: 2% of CIF
  VAT: 16% of (CIF + Import Duty + Excise)
  Port handling + clearing agent: ~$80–120/unit
  Total effective uplift on CIF: ~53–58%

Tanzania (Dar es Salaam):
  Import Duty: 25% of CIF
  VAT: 18% of (CIF + Import Duty)
  Port handling + clearing agent: ~$90–130/unit
  Total effective uplift on CIF: ~46–50%

Uganda (Kampala, via Mombasa):
  Kenya transit + Uganda duty 25% + Uganda VAT 18%
  Total effective uplift on CIF: ~80–92%

Ethiopia (via Djibouti):
  Import Duty: 35% of CIF
  VAT: 15%
  Port handling + clearing agent: ~$120–160/unit
  Total effective uplift on CIF: ~57–64%

Nigeria (Lagos):
  Import Duty: 35% of CIF
  VAT: 7.5%
  Port surcharges + clearing: $250–450/unit
  Total effective uplift on CIF: ~47–55% + fixed surcharges

Ghana (Tema/Accra):
  Import Duty: 20% of CIF
  VAT: 15% + NHIL 2.5% + GETCF 1%
  Port handling + clearing: ~$100–140/unit
  Total effective uplift on CIF: ~41–46%

Mozambique (Nacala / Beira / Maputo):
  Import Duty: 20% of CIF
  VAT: 17%
  Port handling + clearing: ~$80–110/unit
  Total effective uplift on CIF: ~40–44%

South Africa (Durban):
  Import Duty: 0% (SADC preference, used bikes)
  VAT: 15%
  Port handling + clearing: ~$150–250/unit
  Total effective uplift on CIF: ~17–20%

BATCH SCHEDULE:
- TrueWagon runs shared container batches every 4–6 weeks from Osaka/Kobe
- Current batch: collecting for October 2026 departure
- Minimum 3 bikes to join shared batch; 10+ bikes anchors a dedicated slot
- Buyers can lock in FOB price now and join the next batch

LOCAL COMPARISON PRICES (new, Kenya market, KSH):
- Honda Super Cub / Wave 110: 104,000–135,000
- Honda CB125F: 145,000–175,000
- Yamaha YBR / Crux: 115,000–148,000
- Suzuki GN125: 110,000–140,000
- Generic 110cc: 65,000–95,000

Exchange rate: 1 USD ≈ 130 KSH

IMPORTANT RULES:
- Never invent data outside the ranges above
- For destinations without explicit data, use closest regional equivalent and flag in notes
- Be honest about uncertainty: use mid-range values when inputs are vague
- Always return VALID JSON only — no markdown code fences, no explanation outside the JSON object

Return this exact JSON shape:
{
  "fobPerUnit": number,
  "freightPerUnit": number,
  "dutyAndTaxPerUnit": number,
  "portHandlingPerUnit": number,
  "totalLandedPerUnit": number,
  "totalLandedBatch": number,
  "kshPerUnit": number,
  "kshBatch": number,
  "localPriceKSH": number,
  "savingsPercent": number,
  "batchStatus": "collecting",
  "estimatedDeparture": string,
  "containerType": "LCL" | "20ft" | "40ft",
  "qualifiesForBatch": boolean,
  "notes": string,
  "breakdown": {
    "fob": string,
    "freight": string,
    "importDuty": string,
    "vat": string,
    "otherTaxes": string,
    "portHandling": string
  }
}`;

export interface ShippingEstimate {
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
  batchStatus: "collecting" | "ready" | "departed";
  estimatedDeparture: string;
  containerType: "LCL" | "20ft" | "40ft";
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bikes, makeModel, destination } = body as {
      bikes: number;
      makeModel: string;
      destination: string;
    };

    if (!bikes || !makeModel || !destination) {
      return NextResponse.json(
        { error: "Missing required fields: bikes, makeModel, destination" },
        { status: 400 }
      );
    }

    if (typeof bikes !== "number" || bikes < 1 || bikes > 50) {
      return NextResponse.json(
        { error: "bikes must be a number between 1 and 50" },
        { status: 400 }
      );
    }

    const userMessage = `Calculate the landed cost for importing ${bikes} unit${bikes > 1 ? "s" : ""} of ${makeModel} to ${destination}.`;

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response format from model" },
        { status: 500 }
      );
    }

    let result: ShippingEstimate;
    try {
      result = JSON.parse(block.text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse model response as JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API error: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
