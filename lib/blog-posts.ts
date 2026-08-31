export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  content: Section[];
}

export interface Section {
  type: "h2" | "p" | "ul" | "ol" | "cta";
  text?: string;
  items?: string[];
  ctaText?: string;
  ctaHref?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "import-motorcycle-japan-kenya",
    title: "How to Import a Motorcycle from Japan to Kenya (2025 Guide)",
    description:
      "A step-by-step guide to safely importing a used motorcycle from Japan to Kenya — covering sourcing, documentation, shipping, and port clearance in Mombasa.",
    publishedAt: "2025-08-15",
    readingTime: "7 min read",
    category: "Import Guide",
    content: [
      {
        type: "p",
        text: "Kenya imports tens of thousands of used motorcycles from Japan every year. The Japan–Kenya corridor is one of the most established used-vehicle trade routes in East Africa, and for good reason: Japanese bikes are reliable, well-maintained, and priced far below equivalent new units. But the process has real pitfalls — and most buyers learn about them after they've already lost money.",
      },
      {
        type: "h2",
        text: "Why Japan?",
      },
      {
        type: "p",
        text: "Japan's strict shaken (vehicle inspection) system means bikes are retired well before they wear out mechanically. A 5-year-old Honda CB125 with 20,000km is a perfectly good machine in Japan but gets replaced anyway. That creates an enormous pool of low-mileage, well-serviced bikes that export to markets like Kenya, Tanzania, and Uganda at a fraction of new prices.",
      },
      {
        type: "h2",
        text: "Step 1 — Find a Verified Exporter",
      },
      {
        type: "p",
        text: "This is where most deals go wrong. The Japanese export market has many legitimate players and a fair number of bad actors. A verified exporter should be able to provide: a trade licence, auction sheet from the original Japanese auction (showing the grade and mileage), and clear photos of the actual unit — not stock images.",
      },
      {
        type: "ul",
        items: [
          "Ask for the auction sheet — every Japanese auction vehicle has one. If they can't provide it, walk away.",
          "Check the chassis/VIN number against the auction sheet before paying anything.",
          "Prefer exporters who are members of JUMVEA (Japan Used Motor Vehicle Export Association).",
          "Use a platform that verifies sellers before they can list — it removes the vetting burden from you.",
        ],
      },
      {
        type: "h2",
        text: "Step 2 — Agree Price and Terms (FOB vs CIF)",
      },
      {
        type: "p",
        text: "Most Japanese exporters quote FOB (Free On Board) — meaning the price covers the bike loaded onto the ship in Japan, and you pay freight and insurance separately. CIF (Cost, Insurance, Freight) includes everything to the destination port. For Kenya, the destination port is Mombasa.",
      },
      {
        type: "p",
        text: "A typical FOB price for a Honda CB125 in good condition runs USD 800–1,400 depending on year and mileage. Freight from Japan to Mombasa adds roughly USD 300–500. Budget an additional USD 200–400 for port handling and clearing agent fees.",
      },
      {
        type: "h2",
        text: "Step 3 — Documentation You Must Have",
      },
      {
        type: "p",
        text: "The Kenya Revenue Authority (KRA) requires specific documents for motorcycle importation. Missing any of these will delay your clearance — sometimes by weeks.",
      },
      {
        type: "ol",
        items: [
          "Bill of Lading — issued by the shipping line, proves the bike is on board",
          "Export Certificate (MLIT Form) — Japanese Ministry of Land, Infrastructure, Transport and Tourism deregistration form",
          "Commercial Invoice — showing the agreed sale price",
          "Packing List — basic description of the shipment",
          "Insurance Certificate — required for customs valuation",
          "Pre-Shipment Inspection Report — KRA-approved inspection before loading in Japan",
        ],
      },
      {
        type: "h2",
        text: "Step 4 — Shipping and Transit",
      },
      {
        type: "p",
        text: "Motorcycles typically ship in shared containers (groupage/LCL) from Japanese ports — Yokohama, Nagoya, or Osaka — to Mombasa. Transit time is 25–35 days. Your freight agent will track the vessel and notify you when the Bill of Lading is issued.",
      },
      {
        type: "p",
        text: "Once the ship arrives, you have a free storage window at the port (usually 7 days) before demurrage charges begin. Have your clearing agent ready before the vessel docks.",
      },
      {
        type: "h2",
        text: "Step 5 — Mombasa Port Clearance",
      },
      {
        type: "p",
        text: "Your Mombasa clearing agent handles customs entry filing on the KRA iTax system, pays import duty (25% of customs value for motorcycles), VAT (16%), and IDF/RDL levies. Total landed cost is typically 45–55% above the CIF value. Factor this into your budget from the start.",
      },
      {
        type: "h2",
        text: "Common Mistakes to Avoid",
      },
      {
        type: "ul",
        items: [
          "Paying a full deposit to an exporter you've never verified — always use escrow or a platform with dispute protection",
          "Ignoring the chassis number — run it against the IAAI or auction sheet before any payment",
          "Undervaluing the customs invoice to reduce duty — KRA has reference databases and will reassess",
          "Using an unlicensed clearing agent — they can't file on iTax and your goods sit at port",
          "Not budgeting for demurrage — if your documents aren't ready, port storage fees add up fast",
        ],
      },
      {
        type: "cta",
        ctaText: "Browse verified Japanese motorcycles →",
        ctaHref: "/browse",
      },
    ],
  },
  {
    slug: "red-flags-imported-motorcycle",
    title: "7 Red Flags When Buying an Imported Motorcycle from Japan",
    description:
      "How to spot a scam or a bad deal before you wire any money. A practical checklist for buyers importing used motorcycles from Japan to Africa.",
    publishedAt: "2025-08-20",
    readingTime: "5 min read",
    category: "Buyer Safety",
    content: [
      {
        type: "p",
        text: "The Japan used-motorcycle export market is large, legitimate, and well-established — but it also attracts a steady number of bad actors who prey on buyers who don't know what to check. Most scams follow predictable patterns. Here are the seven warning signs that should make you stop a deal immediately.",
      },
      {
        type: "h2",
        text: "1. No Auction Sheet",
      },
      {
        type: "p",
        text: "Every motorcycle that passes through a Japanese auction house gets a graded auction sheet — a standardised document showing the vehicle's condition, mileage, and grade (typically 1–5, with 4 and 4.5 being the most common for export). A legitimate Japanese exporter can provide this for any vehicle. If a seller claims the bike came from a private source (and therefore has no auction sheet), you have no independent verification of its condition or mileage. This is the single most common setup for misrepresented vehicles.",
      },
      {
        type: "h2",
        text: "2. Price Significantly Below Market",
      },
      {
        type: "p",
        text: "A Honda CB125 in grade 4 condition doesn't FOB for USD 400. If the price is 30–40% below what comparable units are listing for on GooBike or BikeBros, either the condition is not what it's presented as, or you're looking at a scam. Experienced importers know the market rate. If you don't, spend 30 minutes on GooBike.com before entering any negotiation.",
      },
      {
        type: "h2",
        text: "3. Chassis Number Inconsistency",
      },
      {
        type: "p",
        text: "Ask for the chassis/VIN number before payment and verify it against the auction sheet, the photos (the number is stamped on the frame — ask for a photo of it), and any export documentation. A mismatch between the number on the auction sheet and the number in the photos is an immediate deal-breaker. Reputable sellers understand this check and won't be offended by the request.",
      },
      {
        type: "h2",
        text: "4. Pressure to Pay in Full Upfront",
      },
      {
        type: "p",
        text: "Legitimate exporters typically take a deposit (30–50%) to secure the vehicle, with the balance paid before loading. If a seller insists on 100% payment before providing any documentation, shipping details, or verifiable information — walk away. A payment structure that protects both parties is standard in professional export transactions.",
      },
      {
        type: "h2",
        text: "5. No Physical Business Address or Registration",
      },
      {
        type: "p",
        text: "An exporter operating entirely through WhatsApp with no verifiable business address, no trade licence, and no web presence is a serious risk. JUMVEA (Japan Used Motor Vehicle Export Association) maintains a public member directory. Cross-check any exporter you're considering. Membership isn't a guarantee, but absence is a signal.",
      },
      {
        type: "h2",
        text: "6. Photos That Don't Match the Vehicle Described",
      },
      {
        type: "p",
        text: "Stock photos, mismatched backgrounds, or images that appear across multiple listings on different platforms are a common tell. Before payment, request a photo of the specific chassis number on the actual vehicle alongside a handwritten note with today's date. Any legitimate seller can provide this in minutes.",
      },
      {
        type: "h2",
        text: "7. No Paper Trail on the Deal",
      },
      {
        type: "p",
        text: "A professional export transaction produces documents at every stage: a proforma invoice when the deal is agreed, a commercial invoice at payment, a Bill of Lading when the vehicle ships, and an Export Certificate (MLIT Form) from the Japanese transport ministry. If your seller is reluctant to provide any of these — or hands you documents that look inconsistent or informal — you have no recourse if something goes wrong.",
      },
      {
        type: "p",
        text: "The safest way to avoid all seven of these risks is to deal through a platform that verifies sellers before they can list, holds document records for every deal, and provides dispute resolution if something goes wrong. That's exactly what TrueWagon was built to do.",
      },
      {
        type: "cta",
        ctaText: "Browse verified sellers only →",
        ctaHref: "/browse",
      },
    ],
  },
  {
    slug: "motorcycle-import-documents-east-africa",
    title: "Documents Required to Import a Motorcycle into East Africa",
    description:
      "The complete document checklist for importing used motorcycles into Kenya, Tanzania, and Uganda — what each document is, who issues it, and what happens if it's missing.",
    publishedAt: "2025-08-28",
    readingTime: "6 min read",
    category: "Documentation",
    content: [
      {
        type: "p",
        text: "Getting your motorcycle through customs in East Africa without delays comes down almost entirely to having the right documents in order before the vessel arrives. A missing or incorrect document doesn't just slow things down — it can result in your bike sitting at port incurring daily demurrage charges while you scramble to obtain what should have been arranged weeks earlier. This is the complete checklist.",
      },
      {
        type: "h2",
        text: "Documents Issued in Japan (Before Shipping)",
      },
      {
        type: "ol",
        items: [
          "Export Certificate (MLIT Form / Yushutsu Shomeisho) — issued by Japan's Ministry of Land, Infrastructure, Transport and Tourism. This is the deregistration document proving the vehicle has been formally removed from Japanese records. Without it, your bike cannot be registered in Kenya.",
          "Auction Sheet — not a legal requirement but essential proof of the vehicle's grade, mileage, and condition at time of purchase. Your clearing agent will want this.",
          "Commercial Invoice — the agreed sale price between you and the exporter. Used by customs to calculate import duty. Must show the vehicle's make, model, year, chassis number, and FOB value in USD.",
          "Packing List — a basic description of what's being shipped. Sounds trivial but customs will ask for it.",
          "Pre-Shipment Inspection Certificate — for Kenya, this must be issued by a KRA-approved inspection company operating in Japan (e.g., SGS, Bureau Veritas, Intertek). Book this before the vehicle is loaded.",
        ],
      },
      {
        type: "h2",
        text: "Documents Issued by the Shipping Line",
      },
      {
        type: "ol",
        items: [
          "Bill of Lading (B/L) — the most important single document in the shipment. Issued by the shipping line once the vehicle is loaded, it is your proof of ownership of the cargo in transit. The original B/L must be surrendered at the destination port to release the vehicle. Guard it carefully.",
          "Freight Invoice — confirms freight charges paid. Needed for CIF valuation at customs.",
        ],
      },
      {
        type: "h2",
        text: "Documents for Kenya Specifically",
      },
      {
        type: "p",
        text: "Kenya Revenue Authority requires all imports to be processed through the iCMS (Integrated Customs Management System). Your clearing agent files the customs entry electronically. In addition:",
      },
      {
        type: "ul",
        items: [
          "IDF (Import Declaration Form) — filed through the Kenya TradeNet system before the vessel arrives. Your clearing agent handles this.",
          "Insurance Certificate — KRA requires proof of marine insurance for customs valuation.",
          "KRA Pin Certificate — your personal or business PIN used for all tax filings.",
          "KEBS Import Inspection Certificate — Kenya Bureau of Standards may require an inspection for certain vehicle categories. Check current requirements with your agent before shipping.",
        ],
      },
      {
        type: "h2",
        text: "Documents for Tanzania",
      },
      {
        type: "p",
        text: "Tanzania processes imports through the Tanzania Revenue Authority (TRA). Requirements largely mirror Kenya's with a few differences: Tanzania requires a TBS (Tanzania Bureau of Standards) import permit for vehicles, and the pre-shipment inspection must be conducted by a TBS-approved company. Destination port is Dar es Salaam.",
      },
      {
        type: "h2",
        text: "Documents for Uganda",
      },
      {
        type: "p",
        text: "Uganda is landlocked, so vehicles typically clear through Mombasa (Kenya) and transport overland. You'll need Kenyan customs clearance as a transit country, plus Uganda Revenue Authority clearance on arrival. Budget an additional 7–14 days and USD 200–350 for the overland leg.",
      },
      {
        type: "h2",
        text: "What Happens If a Document Is Missing",
      },
      {
        type: "p",
        text: "If the original Bill of Lading is lost, the shipping line can issue a Letter of Indemnity — but this takes time and bank guarantees. If the Export Certificate is missing, you cannot register the vehicle. If the Pre-Shipment Inspection Certificate is missing, Kenya customs will conduct their own inspection at port, which causes delays and additional charges.",
      },
      {
        type: "p",
        text: "The safest approach is to have every document confirmed and in hand before the vessel departs Japan. A good freight agent manages this timeline for you — and a good seller platform keeps a document record for every deal so nothing gets lost between parties.",
      },
      {
        type: "cta",
        ctaText: "Start a verified deal with full document tracking →",
        ctaHref: "/browse",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
