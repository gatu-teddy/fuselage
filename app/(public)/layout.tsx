import { SiteNav } from "@/components/layouts/site-nav";
import { SiteFooter } from "@/components/layouts/site-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  );
}
