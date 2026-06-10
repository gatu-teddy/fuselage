import { SellerNav } from "@/components/layouts/seller-nav";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SellerNav />
      <main className="flex-1 overflow-auto" style={{ backgroundColor: "#F8FAFC" }}>{children}</main>
    </div>
  );
}
