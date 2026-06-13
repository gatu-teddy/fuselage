import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Skip middleware entirely if env vars aren't configured yet
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ── Helper: redirect util ─────────────────────────────────────────────────
  function redirectTo(path: string) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  }

  // ── Buyer portal (/buyer/*) — any authenticated user ─────────────────────
  if (pathname.startsWith("/buyer")) {
    if (!user) return redirectTo("/login");
  }

  // ── Admin portal (/admin/*) — role must be "admin" ────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!user) return redirectTo("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") return redirectTo("/");
  }

  // ── Seller portal (/seller/*) — role must be "seller", approved status ────
  if (pathname.startsWith("/seller")) {
    if (!user) return redirectTo("/login");

    // Fetch role + approval status in one query
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "seller") return redirectTo("/");

    // Check approval — skip if already on the onboarding page to avoid redirect loop
    if (!pathname.startsWith("/seller/onboarding")) {
      const { data: sellerProfile } = await supabase
        .from("seller_profiles")
        .select("status")
        .eq("id", user.id)
        .single();

      if (sellerProfile && sellerProfile.status !== "approved") {
        return redirectTo("/seller/onboarding");
      }
    }
  }

  // Forward the current pathname as a header so server components can read it
  supabaseResponse.headers.set("x-pathname", pathname);

  return supabaseResponse;
}
