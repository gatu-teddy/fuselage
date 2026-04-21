"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ClipboardList, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/buyer/deals", label: "My deals", icon: ClipboardList },
  { href: "/buyer/profile", label: "Profile", icon: User },
];

export function BuyerNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <span className="text-primary-foreground font-black text-xs">F</span>
        </div>
        <span className="font-bold text-sm">Fuselage</span>
      </Link>
      <nav className="flex items-center gap-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
              pathname.startsWith(href)
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ml-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </nav>
    </header>
  );
}
