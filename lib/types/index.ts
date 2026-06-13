export type UserRole = "buyer" | "seller" | "admin";

export type SellerStatus = "pending" | "verified" | "rejected" | "suspended";

export type VehicleType = "car" | "bike";

export type ListingStatus = "draft" | "active" | "reserved" | "sold";

export type AvailabilityStatus = "in_stock" | "en_route" | "pre_order";

export type DealStatus =
  | "inquired"
  | "negotiating"
  | "agreed"
  | "payment_uploaded"
  | "payment_confirmed"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  company_name: string;
  trade_license_number: string;
  trade_license_url?: string;
  city: string;
  website?: string;
  description?: string;
  status: SellerStatus;
  rejection_reason?: string;
  verified_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  position: number;
  is_primary: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color?: string;
  mileage_km?: number;
  chassis_number?: string;
  engine_size?: string;
  price_usd: number;
  description?: string;
  status: ListingStatus;
  availability: AvailabilityStatus;
  eta_date?: string;
  destination_ports: string[];
  features: string[];
  created_at: string;
  updated_at: string;
  images?: ListingImage[];
  seller?: SellerProfile;
}

export interface Deal {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: DealStatus;
  agreed_price_usd?: number;
  shipping_cost_usd?: number;
  destination_country: string;
  destination_port?: string;
  buyer_notes?: string;
  seller_notes?: string;
  tracking_number?: string;
  bill_of_lading_url?: string;
  created_at: string;
  updated_at: string;
  // Legal hold
  legal_hold?: boolean;
  legal_hold_requested_at?: string;
  legal_hold_reason?: string;
  listing?: Listing;
  buyer?: Profile;
  seller?: SellerProfile;
  messages?: DealMessage[];
  payment_proofs?: PaymentProof[];
  deal_documents?: DealDocument[];
}

export interface DealMessage {
  id: string;
  deal_id: string;
  sender_id: string;
  message: string;
  message_type: "text" | "system_event";
  is_flagged?: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  sender?: Profile;
}

export interface LegalHoldRequest {
  id: string;
  deal_id: string;
  requested_by: string;
  requester_role: "buyer" | "seller" | "admin" | "legal";
  reason: string;
  reference_number?: string;
  status: "pending" | "acknowledged" | "exported" | "closed";
  acknowledged_at?: string;
  export_url?: string;
  created_at: string;
}

export interface PaymentProof {
  id: string;
  deal_id: string;
  uploaded_by: string;
  file_url: string;
  file_name?: string;
  file_type?: "pdf" | "image";
  amount_usd?: number;
  wire_reference?: string;
  notes?: string;
  created_at: string;
}

export type DocType =
  | "purchase_agreement"
  | "export_certificate"
  | "port_receipt"
  | "customs_clearance"
  | "insurance"
  | "inspection_report"
  | "power_of_attorney"
  | "bill_of_lading"
  | "other";

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  purchase_agreement:  "Purchase Agreement",
  export_certificate:  "Export Certificate / MLIT Form",
  port_receipt:        "Port Handling Receipt",
  customs_clearance:   "Customs Clearance",
  insurance:           "Insurance Certificate",
  inspection_report:   "Pre-Shipment Inspection Report",
  power_of_attorney:   "Power of Attorney (Port Agent)",
  bill_of_lading:      "Bill of Lading",
  other:               "Other Document",
};

/** Doc types that require a counter-signature from the other party */
export const COUNTER_SIGN_TYPES: DocType[] = ["purchase_agreement", "power_of_attorney"];

export interface DealDocument {
  id: string;
  deal_id: string;
  uploaded_by: string;
  uploader_role: "buyer" | "seller";
  doc_type: DocType;
  doc_label?: string;
  file_url: string;
  file_name: string;
  file_type?: "pdf" | "image";
  notes?: string;
  requires_counter_sign: boolean;
  counter_sign_file_url?: string;
  counter_sign_file_name?: string;
  counter_signed_by?: string;
  counter_signed_at?: string;
  created_at: string;
}

export interface DealEvent {
  id: string;
  deal_id: string;
  actor_id?: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

// ---- Constants ----

export const AFRICAN_COUNTRIES = [
  "Nigeria",
  "Kenya",
  "Ghana",
  "South Africa",
  "Ethiopia",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Egypt",
  "Morocco",
  "Senegal",
  "Ivory Coast",
  "Cameroon",
  "Zambia",
  "Zimbabwe",
];

export const AFRICAN_PORTS = {
  Nigeria: ["Lagos (Apapa)", "Lagos (Tin Can)", "Port Harcourt"],
  Kenya: ["Mombasa"],
  Ghana: ["Tema"],
  "South Africa": ["Durban", "Cape Town"],
  Ethiopia: ["Djibouti (Land)"],
  Tanzania: ["Dar es Salaam"],
  Uganda: ["Mombasa (Land)"],
  Rwanda: ["Mombasa (Land)"],
  Egypt: ["Alexandria", "Port Said"],
  Morocco: ["Casablanca", "Tanger Med"],
  Senegal: ["Dakar"],
  "Ivory Coast": ["Abidjan"],
  Cameroon: ["Douala"],
  Zambia: ["Durban (Land)"],
  Zimbabwe: ["Beira (Land)", "Durban (Land)"],
};

export const VEHICLE_MAKES = {
  car: [
    "Mercedes-Benz",
    "BMW",
    "Porsche",
    "Audi",
    "Land Rover",
    "Range Rover",
    "Lamborghini",
    "Ferrari",
    "Bentley",
    "Rolls-Royce",
    "Aston Martin",
    "McLaren",
    "Maserati",
    "Lexus",
    "Toyota",
    "Chevrolet",
    "Ford",
    "Dodge",
    "Cadillac",
    "Genesis",
  ],
  bike: [
    "Ducati",
    "Harley-Davidson",
    "BMW Motorrad",
    "Triumph",
    "Kawasaki",
    "Yamaha",
    "Honda",
    "Aprilia",
    "MV Agusta",
    "Indian",
    "KTM",
  ],
};

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  inquired: "Inquiry Sent",
  negotiating: "Negotiating",
  agreed: "Deal Agreed",
  payment_uploaded: "Payment Uploaded",
  payment_confirmed: "Payment Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const DEAL_STATUS_COLORS: Record<DealStatus, string> = {
  inquired: "bg-blue-100 text-blue-700",
  negotiating: "bg-yellow-100 text-yellow-700",
  agreed: "bg-purple-100 text-purple-700",
  payment_uploaded: "bg-orange-100 text-orange-700",
  payment_confirmed: "bg-teal-100 text-teal-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-200 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};
