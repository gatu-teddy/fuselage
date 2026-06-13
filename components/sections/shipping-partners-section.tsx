import { c } from "@/lib/tokens";

const partners = ["Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "Evergreen"];

export function ShippingPartnersSection() {
  return (
    <section style={{ backgroundColor: c.bg, borderBottom: `1px solid ${c.border}` }} className="py-14">
      <div className="max-w-[1280px] mx-auto px-8 md:px-16">
        <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest text-center mb-8">
          Shipping Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10">
          {partners.map((name) => (
            <div key={name} style={{ color: c.muted }} className="text-lg font-bold tracking-tight opacity-60">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
