/**
 * Shared form primitives for listing create/edit forms.
 * Both new-listing-form.tsx and edit-listing-form.tsx were duplicating these —
 * extracted here so changes propagate once.
 */
import { c } from "@/lib/tokens";

/** Standard text/select/number input style — use on all listing form inputs. */
export const fieldStyle: React.CSSProperties = {
  width: "100%", height: "42px", border: `1px solid ${c.border}`, borderRadius: "8px",
  padding: "0 12px", fontSize: "14px", outline: "none",
  color: c.primary, backgroundColor: c.surface, boxSizing: "border-box",
  fontFamily: "Inter, sans-serif",
};

/** Card container with an uppercase section label. */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "24px", marginBottom: "20px" }}>
      <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>{title}</p>
      {children}
    </div>
  );
}

/** Labelled field wrapper with optional required marker and hint text. */
export function Field({
  label, required, hint, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
        {label}{required && <span style={{ color: c.error, marginLeft: "2px" }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ color: c.muted, fontSize: "11px", marginTop: "5px" }}>{hint}</p>}
    </div>
  );
}
