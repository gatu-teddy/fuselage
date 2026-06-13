import Link from "next/link";

const c = {
  primary:   "#0F172A",
  green:     "#10B981",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  bg:        "#F8FAFC",
  bgDim:     "#F1F5F9",
  surface:   "#FFFFFF",
  border:    "#E2E8F0",
  muted:     "#64748B",
  body:      "#334155",
  amber:     "#F59E0B",
  amberBg:   "#FEF3C7",
  blue:      "#2563EB",
  blueBg:    "#DBEAFE",
};

const EFFECTIVE_DATE = "13 June 2025";
const CONTACT_EMAIL  = "legal@fuselage.io";
const COMPANY_NAME   = "Fuselage";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function Callout({ variant, children }: { variant: "warning" | "info" | "trust"; children: React.ReactNode }) {
  const styles = {
    warning: { bg: c.amberBg,  border: "#FDE68A",   left: c.amber,   text: "#92400E"  },
    info:    { bg: c.bgDim,    border: c.border,     left: c.primary, text: c.primary  },
    trust:   { bg: c.blueBg,   border: "#BFDBFE",    left: c.blue,    text: "#1D4ED8"  },
  }[variant];

  return (
    <div
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        borderLeft: `4px solid ${styles.left}`,
        borderRadius: "6px",
        padding: "14px 18px",
        marginBottom: "20px",
      }}
    >
      <p style={{ color: styles.text, fontSize: "13px", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
        {children}
      </p>
    </div>
  );
}

// ─── Table of contents ────────────────────────────────────────────────────────
const TOC = [
  { id: "1-acceptance",     label: "1. Acceptance of Terms" },
  { id: "2-nature",         label: "2. Nature of the Platform" },
  { id: "3-eligibility",    label: "3. Eligibility" },
  { id: "4-accounts",       label: "4. Accounts & Registration" },
  { id: "5-verification",   label: "5. Seller Verification — Scope & Limits" },
  { id: "6-listings",       label: "6. Listings & Content" },
  { id: "7-transactions",   label: "7. Transactions Between Users" },
  { id: "8-documents",      label: "8. Transaction Documents & Dispute Support" },
  { id: "9-fees",           label: "9. Fees & Subscriptions" },
  { id: "10-prohibited",    label: "10. Prohibited Conduct" },
  { id: "11-disclaimers",   label: "11. Disclaimers" },
  { id: "12-liability",     label: "12. Limitation of Liability" },
  { id: "13-indemnity",     label: "13. Indemnification" },
  { id: "14-disputes",      label: "14. Disputes Between Users" },
  { id: "15-ip",            label: "15. Intellectual Property" },
  { id: "16-privacy",       label: "16. Privacy" },
  { id: "17-termination",   label: "17. Termination" },
  { id: "18-governing-law", label: "18. Governing Law" },
  { id: "19-changes",       label: "19. Changes to These Terms" },
  { id: "20-contact",       label: "20. Contact" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TermsPage() {
  return (
    <div style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 h-14 flex items-center justify-between">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ backgroundColor: c.primary, width: "26px", height: "26px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: "11px" }}>F</span>
            </div>
            <span style={{ color: c.primary, fontWeight: 800, fontSize: "15px", letterSpacing: "-0.5px" }}>Fuselage</span>
          </Link>
          <Link href="/browse" style={{ color: c.muted, fontSize: "13px", textDecoration: "none" }}>
            ← Back to platform
          </Link>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-10">
        <div className="flex gap-12 items-start">

          {/* ── Sidebar TOC — desktop only ────────────────────────────────── */}
          <aside className="hidden lg:block" style={{ width: "240px", flexShrink: 0, position: "sticky", top: "70px" }}>
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Contents
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {TOC.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  style={{ color: c.muted, fontSize: "12px", textDecoration: "none", padding: "4px 8px", borderRadius: "5px", lineHeight: 1.4 }}
                  className="hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <main style={{ flex: 1, minWidth: 0, maxWidth: "760px" }}>

            {/* Legal review banner */}
            <Callout variant="warning">
              ⚠️ <strong>Draft — pending legal review.</strong> This document has been prepared as a starting point and has not yet been reviewed by a qualified solicitor. It should not be relied upon as legal advice. Before processing any payments or onboarding commercial users, have this reviewed by a lawyer familiar with multi-jurisdictional B2B marketplace law.
            </Callout>

            {/* Title block */}
            <div style={{ marginBottom: "36px" }}>
              <h1 style={{ color: c.primary, fontSize: "30px", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "8px" }}>
                Terms of Service
              </h1>
              <p style={{ color: c.muted, fontSize: "13px" }}>
                Effective date: <strong>{EFFECTIVE_DATE}</strong> · Last updated: <strong>{EFFECTIVE_DATE}</strong>
              </p>
            </div>

            {/* ── 1. Acceptance ─────────────────────────────────────────── */}
            <H2 id="1-acceptance">1. Acceptance of Terms</H2>
            <P>
              By accessing or using the {COMPANY_NAME} platform (the <strong>"Platform"</strong>), including any website,
              mobile application, or related service operated by {COMPANY_NAME} (<strong>"we"</strong>, <strong>"us"</strong>,
              or <strong>"our"</strong>), you (<strong>"User"</strong>, <strong>"you"</strong>) agree to be bound by these
              Terms of Service (<strong>"Terms"</strong>).
            </P>
            <P>
              If you are registering on behalf of a business or legal entity, you represent that you have the authority
              to bind that entity to these Terms, and references to "you" include that entity.
            </P>
            <P>
              <strong>If you do not agree to these Terms, you must not use the Platform.</strong> Continued use
              after any modification constitutes acceptance of the revised Terms.
            </P>

            {/* ── 2. Nature ─────────────────────────────────────────────── */}
            <H2 id="2-nature">2. Nature of the Platform</H2>
            <Callout variant="info">
              This section defines the most important aspect of {COMPANY_NAME}&apos;s legal position. Please read it carefully.
            </Callout>
            <H3>2.1 Introductory service only</H3>
            <P>
              {COMPANY_NAME} is an <strong>online introductory marketplace</strong> that facilitates connections between
              independent exporters (<strong>"Sellers"</strong>) and importers or buyers (<strong>"Buyers"</strong>) of
              used vehicles. {COMPANY_NAME} is not a vehicle dealer, exporter, importer, logistics provider,
              freight forwarder, or shipping agent.
            </P>
            <H3>2.2 Fuselage is not a party to transactions</H3>
            <P>
              <strong>
                Any contract for the sale, purchase, shipment, or transfer of vehicles is formed exclusively
                between the Buyer and the Seller. {COMPANY_NAME} is not a party to that contract and accepts
                no obligations, responsibilities, or liability arising from it.
              </strong>
            </P>
            <P>
              {COMPANY_NAME} does not take title to any vehicle, does not hold funds on behalf of either party,
              does not arrange or supervise shipping or delivery, and does not act as an agent for either party
              in connection with any transaction.
            </P>
            <H3>2.3 No escrow or payment processing</H3>
            <P>
              {COMPANY_NAME} does not operate an escrow service and does not process, hold, or transfer transaction
              funds between Buyers and Sellers. Payment terms, methods, and arrangements are agreed solely between
              the Buyer and Seller. {COMPANY_NAME} has no visibility into, and accepts no responsibility for,
              any payments made between users.
            </P>
            <H3>2.4 Same structure as leading global marketplaces</H3>
            <P>
              This introductory-platform model — where the marketplace connects parties but is not a party to
              the underlying transaction — is the same structure used by major global B2B and consumer marketplaces.
              Users deal with each other directly and are each responsible for conducting their own due diligence.
            </P>

            {/* ── 3. Eligibility ─────────────────────────────────────────── */}
            <H2 id="3-eligibility">3. Eligibility</H2>
            <P>To use the Platform you must:</P>
            <UL items={[
              "Be at least 18 years of age;",
              "Have the legal capacity to enter into binding contracts in your jurisdiction;",
              "Be a duly registered and lawfully operating business or sole trader (for Seller accounts);",
              "Not be subject to any sanction, embargo, or trade restriction that would prohibit use of the Platform;",
              "Comply with all applicable laws and regulations in your jurisdiction and in any destination country.",
            ]} />

            {/* ── 4. Accounts ─────────────────────────────────────────────── */}
            <H2 id="4-accounts">4. Accounts & Registration</H2>
            <P>
              You must provide accurate, complete, and current information during registration and keep it updated.
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activity that occurs under your account.
            </P>
            <P>
              {COMPANY_NAME} reserves the right to suspend or terminate any account that provides false, misleading,
              or fraudulent information, without notice and without liability to you.
            </P>

            {/* ── 5. Verification ─────────────────────────────────────────── */}
            <H2 id="5-verification">5. Seller Verification — Scope & Limits</H2>
            <Callout variant="warning">
              <strong>Important:</strong> The term &quot;verified&quot; on this Platform relates only to identity and document checks. It does not constitute a guarantee, endorsement, or warranty of any seller&apos;s commercial reliability, financial standing, or ability to perform any transaction.
            </Callout>
            <H3>5.1 What verification means</H3>
            <P>
              Sellers on the Platform may display a <strong>"Identity Verified"</strong> or similar status badge.
              This badge indicates only that {COMPANY_NAME} has received and reviewed documents submitted by the
              Seller — such as a business registration certificate, trade licence, or government-issued identity
              document — and that those documents appear on their face to relate to an existing, registered
              business entity.
            </P>
            <H3>5.2 What verification does NOT mean</H3>
            <P>Verification does <strong>not</strong> mean, and should not be construed to mean, that {COMPANY_NAME}:</P>
            <UL items={[
              "Has audited, inspected, or vouched for the quality, condition, or specifications of any vehicle listed;",
              "Guarantees or warrants that a Seller will perform any transaction, deliver any goods, or honour any commitment;",
              "Has assessed or guarantees the Seller's financial solvency or creditworthiness;",
              "Has verified the accuracy or completeness of any listing description;",
              "Has performed checks beyond those relating to the documents submitted by the Seller;",
              "Endorses or recommends any Seller or any particular transaction.",
            ]} />
            <H3>5.3 Buyer due diligence obligation</H3>
            <P>
              <strong>
                Buyers are solely responsible for conducting their own due diligence before entering into any
                transaction with a Seller.
              </strong>{" "}
              This includes, without limitation, independently verifying the Seller&apos;s identity, business standing,
              the vehicle&apos;s condition and provenance, applicable import regulations, and shipping logistics.
              {COMPANY_NAME} strongly recommends engaging qualified legal, financial, and logistics advisers
              before committing to any international vehicle purchase.
            </P>

            {/* ── 6. Listings ─────────────────────────────────────────────── */}
            <H2 id="6-listings">6. Listings & Content</H2>
            <H3>6.1 Seller responsibility for listings</H3>
            <P>
              Sellers are solely responsible for the accuracy, completeness, and legality of all information
              they post on the Platform, including vehicle descriptions, specifications, prices, images, VIN numbers,
              and availability status. {COMPANY_NAME} does not verify listing content.
            </P>
            <H3>6.2 Prohibited listings</H3>
            <P>Sellers must not list vehicles that are:</P>
            <UL items={[
              "Stolen, subject to finance, lien, or third-party ownership claims;",
              "Subject to any export restriction, sanction, or embargo applicable in the source or destination country;",
              "Materially misrepresented in specification, condition, or provenance;",
              "Otherwise unlawful to sell, export, or import under any applicable law.",
            ]} />
            <P>
              {COMPANY_NAME} reserves the right to remove any listing at its sole discretion and without liability.
            </P>
            <H3>6.3 VIN and chassis numbers</H3>
            <P>
              VIN / chassis numbers are masked on public listing pages and revealed only to users who have
              initiated an inquiry. Sellers warrant that all VINs submitted are accurate and relate to the
              vehicle being offered. Submission of false VIN data may result in immediate account termination
              and may constitute fraud under applicable law.
            </P>

            {/* ── 7. Transactions ─────────────────────────────────────────── */}
            <H2 id="7-transactions">7. Transactions Between Users</H2>
            <P>
              When a Buyer and Seller agree to a transaction facilitated through the Platform, they enter into
              a direct contractual relationship with each other. {COMPANY_NAME} is not a party to that agreement
              and bears no responsibility for:
            </P>
            <UL items={[
              "The condition of any vehicle at time of delivery;",
              "Delays, damage, or loss during shipping or transit;",
              "Failed, cancelled, or disputed transactions;",
              "Compliance with import duties, taxes, or regulations in the destination country;",
              "Currency exchange risks or payment disputes;",
              "The legal enforceability of any agreement between Buyer and Seller.",
            ]} />
            <P>
              {COMPANY_NAME} strongly recommends that Buyers and Sellers formalise their agreements in writing
              with clearly defined payment terms, delivery conditions, inspection rights, and dispute resolution
              mechanisms, and that each party seeks independent legal advice.
            </P>

            {/* ── 8. Transaction Documents & Dispute Support ────────────── */}
            <H2 id="8-documents">8. Transaction Documents & Dispute Support</H2>
            <Callout variant="trust">
              📁 <strong>Document Custodian Role.</strong> {COMPANY_NAME} provides a neutral document registry for transactions conducted on the Platform. Uploading complete transaction documents adds a verifiable record that {COMPANY_NAME} can provide to legal representatives in the event of a dispute. Incomplete documentation limits this support. Read this section carefully.
            </Callout>

            <H3>8.1 Document custody role</H3>
            <P>
              {COMPANY_NAME} provides a transaction document repository (<strong>"Document Registry"</strong>) as part
              of the Platform. When Buyers and Sellers upload documents in connection with a transaction — including
              but not limited to proforma invoices, export certificates, bills of lading, proof of funds, insurance
              certificates, and pre-shipment inspection reports — those documents are stored by {COMPANY_NAME} as
              part of the timestamped transaction record.
            </P>
            <P>
              {COMPANY_NAME} acts solely as a <strong>neutral document repository</strong>. {COMPANY_NAME} does not
              verify the authenticity, accuracy, or legal validity of any uploaded document, and does not represent
              that any uploaded document satisfies the requirements of any applicable law, regulation, or contract.
              {COMPANY_NAME} is not a notary, escrow agent, or legal adviser.
            </P>

            <H3>8.2 Consent to disclose documents in disputes</H3>
            <P>
              By uploading any document in connection with a transaction on the Platform, you expressly and
              irrevocably grant {COMPANY_NAME} permission to disclose that document to:
            </P>
            <UL items={[
              "The counterparty in your transaction (the Buyer or Seller, as applicable);",
              "That counterparty's verified legal representatives, solicitors, or counsel;",
              "Relevant regulatory authorities, courts, arbitral bodies, or law enforcement agencies; and",
              "Any other party as required by applicable law or a valid legal process (including court orders and subpoenas),",
            ]} />
            <P>
              <strong>solely in connection with a bona fide dispute, legal proceeding, or regulatory inquiry
              arising from that transaction.</strong>
            </P>
            <P>
              This consent is given freely and knowingly. It constitutes your lawful basis under applicable data
              protection law — including the UK GDPR, the EU GDPR, and equivalent national legislation — for
              {COMPANY_NAME} to process and share your uploaded documents for the purposes described above.
              You may not withdraw this consent in respect of documents already uploaded in connection with a
              transaction that is the subject of an active or threatened dispute.
            </P>

            <H3>8.3 Conditions for document disclosure</H3>
            <P>
              {COMPANY_NAME} will disclose transaction documents only in response to one or more of the following:
            </P>
            <UL items={[
              <><strong>Formal legal process</strong> — a court order, arbitral award, regulatory notice, or a written demand on law firm letterhead from a verified legal representative acting for a party to the transaction;</>,
              <><strong>Mutual written consent</strong> — express written agreement from both the Buyer and the Seller to share the document package with a specified recipient; or</>,
              <><strong>Platform dispute process</strong> — a formal dispute opened through the Platform&apos;s dispute resolution mechanism, where disclosure is necessary to facilitate resolution.</>,
            ]} />
            <P>
              {COMPANY_NAME} will not disclose transaction documents to any person based solely on an unverified
              claim that they have suffered loss or been wronged in connection with a transaction. Requests for
              document disclosure must be directed to <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: c.primary, fontWeight: 600 }}>{CONTACT_EMAIL}</a> with sufficient identifying information to verify the requester&apos;s standing.
            </P>

            <H3>8.4 No warranty as to document authenticity</H3>
            <P>
              {COMPANY_NAME} stores documents exactly as uploaded by users and makes no representation, warranty,
              or guarantee as to their authenticity, accuracy, completeness, or fitness for any purpose. The
              evidentiary weight of any document in legal proceedings is a matter for the relevant court or
              authority to determine. {COMPANY_NAME} accepts no liability for any reliance placed on documents
              that are found to be false, forged, altered, or materially inaccurate.
            </P>

            <H3>8.5 The trust gap — consequences of incomplete documentation</H3>
            <Callout variant="warning">
              The security and evidentiary value of a transaction is directly proportional to the completeness of documentation uploaded by <strong>both</strong> parties. Failure to maintain a complete transaction record is the sole responsibility of the party who failed to upload.
            </Callout>
            <P>
              Both Buyers and Sellers are strongly encouraged to upload all material transaction documents
              promptly upon execution. Where either party fails, refuses, or neglects to upload required or
              requested transaction documents:
            </P>
            <UL items={[
              <><strong>Limited support:</strong> {COMPANY_NAME}&apos;s ability to assist with dispute resolution is correspondingly and proportionally limited by the absence of that documentation;</>,
              <><strong>No obligation to assist:</strong> {COMPANY_NAME} shall have no obligation to assist the non-uploading party in any dispute to the extent that the missing documentation was material to their claim or defence; and</>,
              <><strong>No liability:</strong> {COMPANY_NAME} accepts no liability of any kind — whether in contract, tort, or otherwise — for any outcome, loss, or prejudice arising from incomplete, absent, or untimely transaction documentation.</>,
            ]} />
            <P>
              Each party acknowledges that this allocation of responsibility is reasonable, reflects the
              voluntary nature of document upload, and forms part of the essential basis of their agreement
              with {COMPANY_NAME}.
            </P>

            <H3>8.6 Document retention</H3>
            <P>
              {COMPANY_NAME} retains transaction documents for a period of <strong>seven (7) years</strong> from
              the date of the last recorded activity in the relevant transaction, after which they may be
              permanently deleted in accordance with the Privacy Policy. Users who require long-term preservation
              of transaction documents for their own records, insurance, or regulatory purposes should maintain
              independent copies and must not rely solely on {COMPANY_NAME}&apos;s storage for this purpose.
            </P>

            {/* ── 9. Fees ─────────────────────────────────────────────────── */}
            <H2 id="9-fees">9. Fees & Subscriptions</H2>
            <H3>9.1 Seller subscription plans</H3>
            <P>
              Access to certain Platform features is subject to a paid subscription plan (<strong>"Plan"</strong>).
              Current Plan pricing and feature entitlements are published on the Platform and may be updated
              from time to time with reasonable notice. Continued use of the Platform after a price change
              constitutes acceptance of the revised pricing.
            </P>
            <H3>9.2 Free tier</H3>
            <P>
              {COMPANY_NAME} offers a free tier with limited features. {COMPANY_NAME} reserves the right to
              modify, restrict, or discontinue the free tier at any time with 30 days&apos; notice.
            </P>
            <H3>9.3 No refunds</H3>
            <P>
              Unless required by applicable law, subscription fees are non-refundable. If your account is
              terminated for breach of these Terms, no refund will be issued.
            </P>
            <H3>9.4 Buyer use</H3>
            <P>
              Buyer access to the Platform is currently free of charge. {COMPANY_NAME} reserves the right to
              introduce fees for Buyer features in the future with appropriate notice.
            </P>

            {/* ── 10. Prohibited ─────────────────────────────────────────── */}
            <H2 id="10-prohibited">10. Prohibited Conduct</H2>
            <P>You must not use the Platform to:</P>
            <UL items={[
              "Post false, misleading, or fraudulent listings or information;",
              "Circumvent the Platform by conducting transactions off-platform to avoid fees — for Sellers on paid plans, this constitutes a material breach;",
              "Harass, threaten, or abuse other users;",
              "Violate any applicable export control, sanctions, anti-money-laundering, or anti-bribery law;",
              "Upload malware, engage in phishing, or attempt to gain unauthorised access to any system;",
              "Scrape, crawl, or systematically extract Platform data without written consent;",
              "Impersonate another person or entity or misrepresent your affiliation with any person or entity;",
              "Upload documents you know to be false, forged, altered, or materially misleading — this constitutes a serious breach and may constitute fraud under applicable criminal law;",
              "Use the Platform for any purpose that is unlawful or not permitted by these Terms.",
            ]} />

            {/* ── 11. Disclaimers ─────────────────────────────────────────── */}
            <H2 id="11-disclaimers">11. Disclaimers</H2>
            <P>
              <strong>The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              express or implied.</strong> To the fullest extent permitted by applicable law, {COMPANY_NAME}
              disclaims all warranties, including but not limited to:
            </P>
            <UL items={[
              "Merchantability, fitness for a particular purpose, and non-infringement;",
              "The accuracy, completeness, or currency of any listing or user-submitted content;",
              "Uninterrupted, error-free, or secure access to the Platform;",
              "That any Seller is reliable, solvent, or will perform any transaction;",
              "That the Platform will meet your business requirements.",
            ]} />
            <P>
              {COMPANY_NAME} does not endorse any Seller, vehicle, or transaction and makes no representation
              that any vehicle listed on the Platform complies with the import regulations of any destination country.
              Buyers are solely responsible for verifying compliance.
            </P>

            {/* ── 12. Liability ─────────────────────────────────────────── */}
            <H2 id="12-liability">12. Limitation of Liability</H2>
            <Callout variant="warning">
              This section significantly limits {COMPANY_NAME}&apos;s liability. Read it carefully. Some jurisdictions do not allow certain exclusions or limitations — in those jurisdictions, the exclusions below apply to the maximum extent permitted by law.
            </Callout>
            <H3>12.1 Exclusion of indirect losses</H3>
            <P>
              To the fullest extent permitted by applicable law, {COMPANY_NAME} and its officers, directors,
              employees, agents, and affiliates shall not be liable for any:
            </P>
            <UL items={[
              "Loss of profits, revenue, business, goodwill, or anticipated savings;",
              "Loss of data or information;",
              "Indirect, incidental, consequential, special, or punitive damages;",
              "Damages arising from any transaction between a Buyer and a Seller;",
              "Damages arising from the failure of any Seller to deliver any vehicle or perform any obligation;",
              "Damages arising from shipping, logistics, customs, or import/export processes;",
              "Damages arising from incomplete, absent, forged, or inaccurate transaction documents uploaded by any user.",
            ]} />
            <H3>12.2 Cap on direct liability</H3>
            <P>
              <strong>
                In all cases, {COMPANY_NAME}&apos;s total aggregate liability to any User for any claim arising
                out of or in connection with the Platform or these Terms — whether in contract, tort (including
                negligence), breach of statutory duty, or otherwise — shall not exceed the greater of:
                (a) the total subscription fees paid by that User to {COMPANY_NAME} in the twelve (12) months
                immediately preceding the event giving rise to the claim; or (b) USD $100.
              </strong>
            </P>
            <H3>12.3 Essential basis of the bargain</H3>
            <P>
              You acknowledge that the limitations and exclusions of liability set out in this section reflect
              a reasonable allocation of risk between you and {COMPANY_NAME} and are an essential element of
              the basis of the bargain between you and {COMPANY_NAME}. {COMPANY_NAME} would not have provided
              access to the Platform without these limitations.
            </P>

            {/* ── 13. Indemnity ─────────────────────────────────────────── */}
            <H2 id="13-indemnity">13. Indemnification</H2>
            <P>
              You agree to indemnify, defend, and hold harmless {COMPANY_NAME} and its officers, directors,
              employees, agents, successors, and assigns from and against any claims, liabilities, damages,
              losses, costs, and expenses (including reasonable legal fees) arising out of or relating to:
            </P>
            <UL items={[
              "Your use of the Platform;",
              "Your listings, content, or any transaction you enter into through the Platform;",
              "Your breach of these Terms or any applicable law or regulation;",
              "Any claim by a third party (including another User) arising from your conduct on the Platform;",
              "Your violation of any third party's rights;",
              "Any document you upload that is found to be false, forged, or misleading.",
            ]} />

            {/* ── 14. Disputes ─────────────────────────────────────────── */}
            <H2 id="14-disputes">14. Disputes Between Users</H2>
            <P>
              <strong>
                {COMPANY_NAME} is not obliged to mediate, arbitrate, or otherwise become involved in any
                dispute between a Buyer and a Seller.
              </strong>{" "}
              If a dispute arises between Users, they are encouraged to resolve it directly and in good faith.
            </P>
            <P>
              Where both parties have maintained a complete transaction record in the Document Registry
              (see <a href="#8-documents" style={{ color: c.primary, fontWeight: 600 }}>Section 8</a>),{" "}
              {COMPANY_NAME} may, at its sole discretion, provide the transaction document package to verified
              legal representatives as described in Section 8.3. This assistance does not constitute mediation,
              arbitration, a finding of fault, or an admission of any liability by {COMPANY_NAME}.
            </P>
            <P>
              Where transaction documentation is incomplete or absent, {COMPANY_NAME}&apos;s capacity to support
              dispute resolution is limited accordingly, as set out in Section 8.5.
            </P>
            <P>
              Users agree to release {COMPANY_NAME} from any claims, demands, and damages arising from or
              in any way connected with disputes between Users.
            </P>

            {/* ── 15. IP ─────────────────────────────────────────────────── */}
            <H2 id="15-ip">15. Intellectual Property</H2>
            <P>
              The Platform, including its design, code, trademarks, and original content, is owned by or
              licensed to {COMPANY_NAME} and is protected by applicable intellectual property laws.
            </P>
            <P>
              By posting listings, images, or other content on the Platform, you grant {COMPANY_NAME} a
              non-exclusive, worldwide, royalty-free licence to use, display, reproduce, and distribute
              that content for the purpose of operating and promoting the Platform.
            </P>
            <P>
              You represent and warrant that you own or have the necessary rights to all content you post,
              and that such content does not infringe the intellectual property rights of any third party.
            </P>

            {/* ── 16. Privacy ─────────────────────────────────────────────── */}
            <H2 id="16-privacy">16. Privacy</H2>
            <P>
              Your use of the Platform is also governed by our{" "}
              <Link href="/privacy" style={{ color: c.primary, fontWeight: 600 }}>Privacy Policy</Link>,
              which is incorporated into these Terms by reference. By using the Platform, you consent to
              the collection and processing of your data as described in the Privacy Policy.
            </P>

            {/* ── 17. Termination ─────────────────────────────────────────── */}
            <H2 id="17-termination">17. Termination</H2>
            <P>
              {COMPANY_NAME} may suspend or terminate your access to the Platform at any time, with or without
              cause, with or without notice. Grounds for termination include but are not limited to:
              breach of these Terms, fraudulent or misleading conduct, failure to pay applicable fees,
              or conduct that is harmful to other Users or to {COMPANY_NAME}&apos;s reputation.
            </P>
            <P>
              Upon termination: (a) your right to access the Platform ceases immediately; (b) we may delete
              your account data in accordance with our Privacy Policy; (c) clauses which by their nature
              should survive (including limitations of liability, indemnity, document custody obligations,
              and governing law) continue to apply.
            </P>
            <P>
              You may terminate your account at any time by contacting us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: c.primary, fontWeight: 600 }}>{CONTACT_EMAIL}</a>.
              Termination does not entitle you to a refund of any subscription fees. Document retention
              obligations under Section 8.6 survive termination.
            </P>

            {/* ── 18. Governing Law ─────────────────────────────────────── */}
            <H2 id="18-governing-law">18. Governing Law & Jurisdiction</H2>
            <P>
              These Terms shall be governed by and construed in accordance with the laws of
              <strong> [JURISDICTION — TO BE CONFIRMED BY LEGAL COUNSEL]</strong>, without regard to
              its conflict of law provisions.
            </P>
            <P>
              Any dispute arising out of or in connection with these Terms that cannot be resolved
              amicably shall be submitted to the exclusive jurisdiction of the courts of
              <strong> [JURISDICTION]</strong>, subject to any mandatory consumer protection laws
              applicable in a User&apos;s country of residence that cannot be excluded by contract.
            </P>
            <Callout variant="warning">
              ⚠️ Jurisdiction should be selected with legal advice considering where {COMPANY_NAME} is incorporated, where most Users are located, and the enforceability of judgments in relevant markets (UAE, UK, Nigeria, Kenya, Pakistan, etc.).
            </Callout>

            {/* ── 19. Changes ─────────────────────────────────────────────── */}
            <H2 id="19-changes">19. Changes to These Terms</H2>
            <P>
              {COMPANY_NAME} reserves the right to modify these Terms at any time. We will provide at least
              14 days&apos; notice of material changes by posting the updated Terms on the Platform and, where
              practicable, by notifying registered Users by email.
            </P>
            <P>
              Your continued use of the Platform after the effective date of any changes constitutes your
              acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop
              using the Platform and, if applicable, cancel your subscription before the changes take effect.
            </P>

            {/* ── 20. Contact ─────────────────────────────────────────────── */}
            <H2 id="20-contact">20. Contact</H2>
            <P>
              For questions about these Terms, notices, or legal correspondence, please contact:
            </P>
            <div
              style={{
                backgroundColor: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: "8px",
                padding: "16px 20px",
                marginBottom: "20px",
              }}
            >
              <p style={{ color: c.primary, fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{COMPANY_NAME}</p>
              <p style={{ color: c.body, fontSize: "13px", marginBottom: "2px" }}>
                Email: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: c.primary, fontWeight: 600 }}>{CONTACT_EMAIL}</a>
              </p>
              <p style={{ color: c.muted, fontSize: "13px" }}>
                Registered address: <strong>[COMPANY REGISTERED ADDRESS — TO BE ADDED]</strong>
              </p>
            </div>

            {/* Footer note */}
            <div
              style={{
                marginTop: "48px",
                paddingTop: "20px",
                borderTop: `1px solid ${c.border}`,
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <Link href="/privacy" style={{ color: c.muted, fontSize: "13px", textDecoration: "none" }} className="hover:text-[#0F172A]">
                Privacy Policy
              </Link>
              <Link href="/browse" style={{ color: c.muted, fontSize: "13px", textDecoration: "none" }} className="hover:text-[#0F172A]">
                Back to Platform
              </Link>
              <span style={{ color: c.muted, fontSize: "13px" }}>© {new Date().getFullYear()} {COMPANY_NAME}</span>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
