import Link from "next/link";
import { TocNav } from "@/components/legal/toc-nav";

import { c } from "@/lib/tokens";

const EFFECTIVE_DATE  = "13 June 2025";
const CONTACT_EMAIL   = "privacy@truewagon.com";
const COMPANY_NAME    = "TrueWagon";
const TERMS_URL       = "/terms";

// ─── Layout helpers ─────────────────────────────────────────────────────────
function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      style={{
        color: c.primary, fontSize: "18px", fontWeight: 700,
        letterSpacing: "-0.3px", marginTop: "40px", marginBottom: "12px",
        paddingBottom: "8px", borderBottom: `1px solid ${c.border}`,
      }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ color: c.primary, fontSize: "15px", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: c.body, fontSize: "14px", lineHeight: 1.75, marginBottom: "14px" }}>
      {children}
    </p>
  );
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ paddingLeft: "20px", marginBottom: "14px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ color: c.body, fontSize: "14px", lineHeight: 1.75, marginBottom: "6px" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Callout({ variant, children }: { variant: "warning" | "info" | "trust" | "gdpr"; children: React.ReactNode }) {
  const styles = {
    warning: { bg: c.amberBg,   border: "#FDE68A",  left: c.amber,   text: "#92400E"  },
    info:    { bg: c.bgDim,     border: c.border,    left: c.primary, text: c.primary  },
    trust:   { bg: c.greenBg,   border: "#A7F3D0",   left: c.green,   text: c.greenText },
    gdpr:    { bg: c.purpleBg,  border: "#DDD6FE",   left: c.purple,  text: "#5B21B6"  },
  }[variant];

  return (
    <div style={{
      backgroundColor: styles.bg, border: `1px solid ${styles.border}`,
      borderLeft: `4px solid ${styles.left}`, borderRadius: "6px",
      padding: "14px 18px", marginBottom: "20px",
    }}>
      <p style={{ color: styles.text, fontSize: "13px", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
        {children}
      </p>
    </div>
  );
}

// ─── Two-column data table ──────────────────────────────────────────────────
function DataTable({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <div style={{ border: `1px solid ${c.border}`, borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
      {rows.map(({ label, value }, i) => (
        <div
          key={i}
          style={{
            display: "grid", gridTemplateColumns: "200px 1fr",
            borderBottom: i < rows.length - 1 ? `1px solid ${c.border}` : "none",
          }}
        >
          <div style={{ backgroundColor: c.bgDim, padding: "10px 14px", borderRight: `1px solid ${c.border}` }}>
            <p style={{ color: c.primary, fontSize: "12px", fontWeight: 600, margin: 0 }}>{label}</p>
          </div>
          <div style={{ padding: "10px 14px" }}>
            <p style={{ color: c.body, fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TOC ────────────────────────────────────────────────────────────────────
const TOC = [
  { id: "1-overview",          label: "1. Overview" },
  { id: "2-controller",        label: "2. Data Controller" },
  { id: "3-what-we-collect",   label: "3. What We Collect" },
  { id: "4-how-we-use",        label: "4. How We Use Your Data" },
  { id: "5-lawful-basis",      label: "5. Lawful Basis (GDPR)" },
  { id: "6-sharing",           label: "6. Who We Share Data With" },
  { id: "7-international",     label: "7. International Transfers" },
  { id: "8-retention",         label: "8. How Long We Keep Data" },
  { id: "9-sensitive",         label: "9. Sensitive & Document Data" },
  { id: "10-cookies",          label: "10. Cookies & Tracking" },
  { id: "11-your-rights",      label: "11. Your Rights" },
  { id: "12-children",         label: "12. Children" },
  { id: "13-security",         label: "13. Security" },
  { id: "14-other-laws",       label: "14. Other Applicable Laws" },
  { id: "15-changes",          label: "15. Changes to This Policy" },
  { id: "16-contact",          label: "16. Contact & Requests" },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function PrivacyPage() {
  return (
    <>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-10">
        <div className="flex gap-12 items-start">

          {/* ── Sidebar TOC — desktop only ────────────────────────────── */}
          <aside className="hidden lg:block" style={{ width: "240px", flexShrink: 0, position: "sticky", top: "70px" }}>
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Contents
            </p>
            <TocNav items={TOC} />
            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${c.border}` }}>
              <p style={{ color: c.muted, fontSize: "11px", marginBottom: "6px" }}>Also read</p>
              <Link href={TERMS_URL} style={{ color: c.blue, fontSize: "12px", textDecoration: "none", fontWeight: 500 }}>
                Terms of Service →
              </Link>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────── */}
          <main style={{ flex: 1, minWidth: 0, maxWidth: "760px" }}>

            {/* Draft banner */}
            <Callout variant="warning">
              ⚠️ <strong>Draft — pending legal review.</strong> This Privacy Policy has been prepared as a starting
              point and has not yet been reviewed by a qualified solicitor or data protection specialist.
              Before going live with EU, UK, or any regulated-jurisdiction users, have this reviewed by a
              lawyer familiar with GDPR and the data protection laws of your operating jurisdictions.
            </Callout>

            {/* Title block */}
            <div style={{ marginBottom: "36px" }}>
              <h1 style={{ color: c.primary, fontSize: "30px", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "8px" }}>
                Privacy Policy
              </h1>
              <p style={{ color: c.muted, fontSize: "13px" }}>
                Effective date: <strong>{EFFECTIVE_DATE}</strong> · Last updated: <strong>{EFFECTIVE_DATE}</strong>
              </p>
            </div>

            {/* ── 1. Overview ───────────────────────────────────────────── */}
            <H2 id="1-overview">1. Overview</H2>
            <P>
              {COMPANY_NAME} (<strong>"we"</strong>, <strong>"us"</strong>, <strong>"our"</strong>) takes the
              privacy of everyone who uses its platform seriously. This Privacy Policy explains what personal
              data we collect, why we collect it, how we use and protect it, and what rights you have over it.
            </P>
            <P>
              This policy applies to all users of the {COMPANY_NAME} website and platform, including
              registered Buyers, registered Sellers (exporters), and unregistered visitors.
            </P>
            <P>
              By using the Platform you acknowledge that you have read this policy. If you do not agree,
              please do not use the Platform.
            </P>

            {/* ── 2. Data Controller ────────────────────────────────────── */}
            <H2 id="2-controller">2. Data Controller</H2>
            <P>
              {COMPANY_NAME} is the data controller for personal data processed through the Platform.
            </P>
            <DataTable rows={[
              { label: "Company name",    value: `${COMPANY_NAME}` },
              { label: "Registered address", value: "[COMPANY REGISTERED ADDRESS — TO BE ADDED]" },
              { label: "Privacy contact", value: CONTACT_EMAIL },
              { label: "Jurisdiction",    value: "[TO BE CONFIRMED — pending legal review]" },
            ]} />
            <P>
              Where required by applicable law (e.g. GDPR Art. 27), we will designate a representative in
              the relevant jurisdiction. If you are located in the EU or UK and have a privacy concern,
              please contact us at <strong>{CONTACT_EMAIL}</strong>.
            </P>

            {/* ── 3. What We Collect ────────────────────────────────────── */}
            <H2 id="3-what-we-collect">3. What Personal Data We Collect</H2>

            <H3>3.1 Account registration data</H3>
            <UL items={[
              "Full name",
              "Email address",
              "Phone number (optional)",
              "Country of residence",
              "Password (stored as a one-way hash — we never store plain-text passwords)",
            ]} />

            <H3>3.2 Seller verification data</H3>
            <Callout variant="gdpr">
              This category includes identity documents and business registration certificates — treated as
              sensitive data subject to stricter access controls. See Section 9.
            </Callout>
            <UL items={[
              "Company name and trade licence number",
              "Copies of trade licences, business registration certificates",
              "Government-issued identity documents (passport, national ID, etc.)",
              "Company address and city",
              "Website URL",
              "Business description",
            ]} />

            <H3>3.3 Listing and vehicle data</H3>
            <UL items={[
              "Vehicle specifications (make, model, year, colour, mileage, VIN / chassis number)",
              "Listing photos and videos uploaded by Sellers",
              "Pricing information",
            ]} />

            <H3>3.4 Transaction and deal data</H3>
            <UL items={[
              "Inquiry messages exchanged between Buyers and Sellers",
              "Agreed prices and deal status",
              "Destination country and port",
              "Payment proof documents uploaded by Buyers (PDF receipts, screenshots)",
              "Transaction documents uploaded by either party (purchase agreements, export certificates, port receipts, bills of lading, insurance certificates, etc.)",
              "Wire transfer references (as entered by users — we do not verify these)",
              "Bill of lading / shipping tracking numbers",
            ]} />

            <H3>3.5 Technical and usage data</H3>
            <UL items={[
              "IP address and approximate geolocation (country/city level)",
              "Browser type, operating system, device type",
              "Pages visited, features used, time spent on Platform",
              "Authentication tokens and session data (via cookies)",
              "Error logs",
            ]} />

            <H3>3.6 Data we do not collect</H3>
            <UL items={[
              "Full payment card numbers (we do not process card payments directly)",
              "Bank account numbers (we do not hold or transfer funds)",
              "Biometric data",
              "Health or medical data",
              "Data relating to children under 18",
            ]} />

            {/* ── 4. How We Use Data ────────────────────────────────────── */}
            <H2 id="4-how-we-use">4. How We Use Your Data</H2>
            <DataTable rows={[
              {
                label: "Providing the Platform",
                value: "Creating and managing your account, displaying listings, facilitating deal communications, storing uploaded documents.",
              },
              {
                label: "Seller verification",
                value: "Reviewing submitted identity and business documents to approve or reject Seller applications. Documents are reviewed by authorised TrueWagon staff only.",
              },
              {
                label: "Deal management",
                value: "Storing the full history of deal status changes, messages, and uploaded documents so both parties have a complete record.",
              },
              {
                label: "Subscription billing",
                value: "Processing subscription payments via Stripe (see Section 6). We pass your email and name to Stripe; card details are handled entirely by Stripe.",
              },
              {
                label: "Platform communications",
                value: "Sending deal-related notifications (e.g. payment uploaded, payment confirmed, new document added). We do not send marketing emails without separate consent.",
              },
              {
                label: "Safety & fraud prevention",
                value: "Detecting and preventing fraudulent listings, fake documents, account impersonation, and sanctions violations.",
              },
              {
                label: "Legal compliance",
                value: "Retaining records as required by applicable law, responding to lawful requests from regulatory or law enforcement authorities.",
              },
              {
                label: "Platform improvement",
                value: "Analysing aggregate, anonymised usage patterns to improve features. We do not sell data for advertising purposes.",
              },
            ]} />

            {/* ── 5. Lawful Basis ───────────────────────────────────────── */}
            <H2 id="5-lawful-basis">5. Lawful Basis for Processing (GDPR)</H2>
            <Callout variant="gdpr">
              This section applies to users located in the European Economic Area (EEA) or the United Kingdom.
              Under GDPR (EU) 2016/679 and UK GDPR, every processing activity must have a lawful basis.
            </Callout>
            <DataTable rows={[
              {
                label: "Contract performance (Art. 6(1)(b))",
                value: "Processing your name, email, account data, deal data, and uploaded documents is necessary to provide the Platform services you have signed up for.",
              },
              {
                label: "Legal obligation (Art. 6(1)(c))",
                value: "Retaining transaction records, identity verification documents, and financial records as required by applicable law in your jurisdiction or ours.",
              },
              {
                label: "Legitimate interests (Art. 6(1)(f))",
                value: "Fraud detection, platform security, analytics (aggregated), and sending transactional notifications directly related to your active deals.",
              },
              {
                label: "Consent (Art. 6(1)(a))",
                value: "Non-essential cookies and any marketing communications. You may withdraw consent at any time without affecting the lawfulness of prior processing.",
              },
            ]} />

            {/* ── 6. Sharing ────────────────────────────────────────────── */}
            <H2 id="6-sharing">6. Who We Share Your Data With</H2>
            <P>
              We do not sell your personal data. We share it only with the following categories of third
              parties, under contractual obligations of confidentiality:
            </P>

            <H3>6.1 Other users of the Platform</H3>
            <P>
              When you initiate or participate in a deal, limited information is shared with the other party
              (e.g. the Buyer sees the Seller&apos;s company name and city; the Seller sees the Buyer&apos;s
              name, country, and email for deal communications). Uploaded documents are visible only to the
              two parties in that deal.
            </P>

            <H3>6.2 Infrastructure and service providers</H3>
            <DataTable rows={[
              { label: "Supabase (Postgres + Storage)", value: "Database hosting, file storage (payment proofs, deal documents, listing images, verification documents). Servers in [region — TO BE CONFIRMED]. Supabase's Data Processing Agreement applies." },
              { label: "Stripe", value: "Subscription billing for Seller plans. Your email, name, and payment method are processed by Stripe under their Privacy Policy. We never see or store full card numbers." },
              { label: "Email provider (TBC)", value: "Transactional email delivery (deal notifications, account emails). Provider to be confirmed before launch; a Data Processing Agreement will be in place." },
              { label: "Vercel", value: "Platform hosting (Next.js application server). Vercel processes request logs including IP addresses. See Vercel's Privacy Policy." },
            ]} />

            <H3>6.3 Admin staff</H3>
            <P>
              Authorised {COMPANY_NAME} administrators can access Seller verification documents and deal records
              for the purpose of identity review, dispute handling, and legal compliance. Access is logged and
              role-restricted.
            </P>

            <H3>6.4 Legal and regulatory disclosure</H3>
            <P>
              We may disclose personal data if required to do so by law, court order, or request of a
              competent regulatory or law enforcement authority, or if we believe in good faith that disclosure
              is necessary to protect the rights, property, or safety of {COMPANY_NAME}, its users, or the public.
            </P>

            <H3>6.5 Business transfers</H3>
            <P>
              In the event of a merger, acquisition, or sale of all or part of {COMPANY_NAME}&apos;s assets,
              personal data held by us may be transferred to the acquiring entity. We will notify affected
              users by email before any such transfer.
            </P>

            {/* ── 7. International transfers ────────────────────────────── */}
            <H2 id="7-international">7. International Data Transfers</H2>
            <P>
              {COMPANY_NAME} uses cloud infrastructure that may process data in multiple jurisdictions. When
              personal data of EU or UK residents is transferred outside the EEA or UK to a country without
              an adequacy decision, we rely on one or more of the following:
            </P>
            <UL items={[
              <>Standard Contractual Clauses (SCCs) adopted by the European Commission — in place with Supabase and Stripe;</>,
              <>The UK International Data Transfer Agreement (IDTA) for UK-originating transfers;</>,
              <>Adequacy decisions where applicable.</>,
            ]} />
            <P>
              For transfers involving other jurisdictions, we apply data minimisation and ensure contractual
              protections are in place with any local service providers.
            </P>

            {/* ── 8. Retention ──────────────────────────────────────────── */}
            <H2 id="8-retention">8. How Long We Keep Your Data</H2>
            <DataTable rows={[
              { label: "Account data", value: "Retained while your account is active. If you delete your account, profile data is deleted within 30 days. Email address retained in a suppression list to honour opt-outs." },
              { label: "Seller verification documents", value: "Retained for 7 years from the date of verification, or as required by applicable AML / KYC law — whichever is longer." },
              { label: "Deal records and messages", value: "Retained for 7 years from deal completion or cancellation. This is required for potential legal dispute resolution and applicable commercial record-keeping law." },
              { label: "Payment proof documents", value: "Retained for 7 years from upload date." },
              { label: "Transaction documents (contracts, B/L, etc.)", value: "Retained for 7 years from deal completion." },
              { label: "Listing data", value: "Active listings retained while your account is active. Sold/archived listings retained for 3 years for audit purposes." },
              { label: "Technical / server logs", value: "90 days, unless retained longer for security incident investigation." },
              { label: "Marketing consent records", value: "Retained until consent is withdrawn, plus 3 years." },
            ]} />
            <P>
              After the applicable retention period, data is securely deleted or anonymised. You may request
              early deletion subject to the exceptions in Section 11.
            </P>

            {/* ── 9. Sensitive & Document Data ─────────────────────────── */}
            <H2 id="9-sensitive">9. Sensitive Data & Uploaded Documents</H2>
            <Callout variant="gdpr">
              Uploaded identity documents and financial records warrant special care. This section explains
              how they are stored and who can access them.
            </Callout>
            <H3>9.1 Identity and verification documents</H3>
            <P>
              Passports, national identity cards, and trade licences submitted for Seller verification are
              stored in Supabase private storage (not publicly accessible). Access is restricted to:
            </P>
            <UL items={[
              "Authorised TrueWagon admin staff, for the purpose of reviewing the application only;",
              "The Seller who submitted the document;",
              "Law enforcement or regulatory authorities where legally required.",
            ]} />
            <H3>9.2 Payment proofs and transaction documents</H3>
            <P>
              Files uploaded to a deal (payment receipts, purchase agreements, bills of lading, etc.) are
              stored in Supabase private storage with access restricted to the two parties in that specific
              deal. Files are accessed via time-limited signed URLs (1-hour expiry). No document is
              publicly accessible by URL.
            </P>
            <H3>9.3 Document integrity</H3>
            <P>
              {COMPANY_NAME} does not independently verify the authenticity of uploaded documents. Users who
              knowingly upload false, forged, or materially misleading documents are in serious breach of our{" "}
              <Link href={TERMS_URL} style={{ color: c.blue }}>Terms of Service</Link> and may be committing
              fraud under applicable law.
            </P>

            {/* ── 10. Cookies ───────────────────────────────────────────── */}
            <H2 id="10-cookies">10. Cookies &amp; Tracking</H2>
            <P>
              {COMPANY_NAME} uses cookies and similar technologies. By using the Platform you consent to
              the use of essential cookies. For non-essential cookies (analytics, preference storage),
              we will seek your consent via a cookie banner before setting them.
            </P>
            <DataTable rows={[
              { label: "Authentication cookies", value: "Set by Supabase Auth to maintain your login session. Essential — cannot be disabled. Expire when you log out or after session timeout." },
              { label: "CSRF protection tokens", value: "Security tokens to prevent cross-site request forgery. Essential." },
              { label: "Analytics cookies (future)", value: "If we implement analytics (e.g. Plausible, PostHog), only privacy-preserving, cookieless analytics will be used where possible. Where cookies are set, we will seek consent first." },
              { label: "Preference cookies (future)", value: "Remembering your filter preferences on the browse page. Non-essential — consent required for EU/UK users." },
            ]} />
            <P>
              You can control cookies through your browser settings. Disabling essential (authentication)
              cookies will prevent you from staying logged in.
            </P>

            {/* ── 11. Your Rights ───────────────────────────────────────── */}
            <H2 id="11-your-rights">11. Your Rights</H2>
            <Callout variant="gdpr">
              The rights below apply in full to EU and UK residents under GDPR / UK GDPR. Users in other
              jurisdictions have equivalent rights under applicable local law — see Section 14.
            </Callout>

            <H3>11.1 Right of access (Art. 15 GDPR)</H3>
            <P>
              You may request a copy of the personal data we hold about you, together with information
              about how it is used.
            </P>

            <H3>11.2 Right to rectification (Art. 16)</H3>
            <P>
              You may request correction of inaccurate or incomplete personal data. For most account data,
              you can update this yourself from your account settings.
            </P>

            <H3>11.3 Right to erasure / "right to be forgotten" (Art. 17)</H3>
            <P>
              You may request deletion of your personal data. We will comply unless we are required to
              retain the data by law (e.g. AML/KYC obligations for verification documents, or commercial
              record-keeping requirements for deal records — see Section 8).
            </P>

            <H3>11.4 Right to restrict processing (Art. 18)</H3>
            <P>
              In certain circumstances you may ask us to limit processing of your data while a dispute
              or correction request is resolved.
            </P>

            <H3>11.5 Right to data portability (Art. 20)</H3>
            <P>
              Where processing is based on consent or contract performance and is carried out by automated
              means, you may request a structured, machine-readable copy of your data.
            </P>

            <H3>11.6 Right to object (Art. 21)</H3>
            <P>
              You may object to processing based on legitimate interests. We will stop unless we have
              compelling legitimate grounds that override your interests, or the processing is necessary
              for legal claims.
            </P>

            <H3>11.7 Rights related to automated decision-making (Art. 22)</H3>
            <P>
              We do not make solely automated decisions with significant legal effects on users. Seller
              application reviews are carried out by human administrators.
            </P>

            <H3>11.8 How to exercise your rights</H3>
            <P>
              Submit a request to <strong>{CONTACT_EMAIL}</strong>. We will respond within <strong>30 days</strong>{" "}
              (extendable by a further 60 days for complex requests, with notice). We may ask you to verify
              your identity before actioning a request.
            </P>
            <P>
              EU/UK users have the right to lodge a complaint with their supervisory authority. For UK
              residents: the Information Commissioner&apos;s Office (<strong>ico.org.uk</strong>). For EU
              residents: the supervisory authority in your Member State.
            </P>

            {/* ── 12. Children ──────────────────────────────────────────── */}
            <H2 id="12-children">12. Children</H2>
            <P>
              The Platform is not directed at and may not be used by persons under the age of 18. We do
              not knowingly collect personal data from children. If you believe we have inadvertently
              collected data from a minor, please contact us at <strong>{CONTACT_EMAIL}</strong> and we
              will delete it promptly.
            </P>

            {/* ── 13. Security ──────────────────────────────────────────── */}
            <H2 id="13-security">13. Security</H2>
            <P>
              We implement appropriate technical and organisational measures to protect your personal data,
              including:
            </P>
            <UL items={[
              "All data in transit encrypted via TLS 1.2+;",
              "Data at rest encrypted by Supabase (AES-256);",
              "Row-level security (RLS) policies on all database tables — each user can only access their own records;",
              "Private storage buckets for all uploaded documents — no public URL access;",
              "Time-limited signed URLs (1-hour expiry) for document access;",
              "Role-based access control — admin access to sensitive data is logged;",
              "Passwords stored as one-way bcrypt hashes (managed by Supabase Auth).",
            ]} />
            <P>
              No system is 100% secure. In the event of a data breach that affects your rights and freedoms,
              we will notify you and the relevant supervisory authority within 72 hours of becoming aware,
              as required by GDPR Art. 33–34.
            </P>

            {/* ── 14. Other Applicable Laws ─────────────────────────────── */}
            <H2 id="14-other-laws">14. Other Applicable Data Protection Laws</H2>
            <P>
              {COMPANY_NAME} operates in a multi-jurisdictional environment. In addition to GDPR and UK GDPR,
              the following laws may apply depending on the location of the user:
            </P>
            <DataTable rows={[
              {
                label: "EU / EEA — GDPR",
                value: "Regulation (EU) 2016/679. Applies when processing personal data of EU residents. Requires a lawful basis, data subject rights, and transfer controls for data leaving the EEA.",
              },
              {
                label: "UK — UK GDPR / DPA 2018",
                value: "The retained UK version of GDPR. Applies when processing personal data of UK residents. Rights and obligations are substantially equivalent to EU GDPR.",
              },
              {
                label: "California — CCPA / CPRA",
                value: "California Consumer Privacy Act and its amendment. Applies to residents of California. Grants rights to know, delete, correct and opt-out of sale of personal information.",
              },
              {
                label: "Australia — Privacy Act 1988",
                value: "Applies to organisations with annual turnover above AUD 3 million, or handling health or sensitive information. Governs collection, use, and disclosure of personal information.",
              },
              {
                label: "Other jurisdictions",
                value: "Where local data protection law applies to our processing of your personal data, we will honour rights equivalent to or broader than those described in this policy. Contact us to exercise any applicable rights.",
              },
            ]} />
            <P>
              Where these laws grant rights equivalent to or broader than GDPR, we will honour them.
              Please contact <strong>{CONTACT_EMAIL}</strong> to exercise any rights under any applicable law.
            </P>

            {/* ── 15. Changes ───────────────────────────────────────────── */}
            <H2 id="15-changes">15. Changes to This Privacy Policy</H2>
            <P>
              We may update this Privacy Policy from time to time. When we make material changes, we will
              notify you by email (to the address on your account) and update the &quot;Last updated&quot;
              date at the top of this page at least 14 days before the changes take effect.
            </P>
            <P>
              Your continued use of the Platform after the effective date of the revised policy constitutes
              your acceptance of the changes. If you do not agree, you should close your account before
              the effective date.
            </P>

            {/* ── 16. Contact ───────────────────────────────────────────── */}
            <H2 id="16-contact">16. Contact &amp; Data Requests</H2>
            <P>
              For any questions about this Privacy Policy, to exercise your data rights, or to report a
              privacy concern:
            </P>
            <DataTable rows={[
              { label: "Email",   value: CONTACT_EMAIL },
              { label: "Subject line", value: "Privacy Request — [Your Name]" },
              { label: "Response time", value: "Within 30 days of receipt" },
              { label: "Address", value: "[COMPANY REGISTERED ADDRESS — TO BE ADDED]" },
            ]} />
            <P>
              If you are not satisfied with our response, you have the right to escalate your complaint to
              the relevant data protection supervisory authority in your jurisdiction.
            </P>

            {/* Bottom spacer */}
            <div style={{ height: "60px" }} />

          </main>
        </div>
      </div>
    </>
  );
}
