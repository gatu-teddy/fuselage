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

  // ── Forward auth state to all server components via request headers ───────
  // Set immediately after getUser() so every code path — including early
  // returns — carries x-user-id.  Page components read this header instead
  // of making a redundant getUser() round-trip (task #14).
  if (user) supabaseResponse.headers.set("x-user-id", user.id);
  supabaseResponse.headers.set("x-pathname", pathname);

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

  // ── Seller portal (/seller/*) — role must be "seller", verified status ────
  if (pathname.startsWith("/seller/") || pathname === "/seller") {
    if (!user) return redirectTo("/login");

    // Onboarding is open to any authenticated user so new registrants (who
    // start as 'buyer') can submit their seller application without being
    // bounced back to the homepage.  x-user-id is already set above.
    if (pathname.startsWith("/seller/onboarding")) {
      return supabaseResponse;
    }

    // Single join query replaces two sequential round-trips (task #17).
    // Fetches role + seller verification status in one PostgREST call.
    const { data: combined } = await supabase
      .from("profiles")
      .select("role, seller_profiles(status)")
      .eq("id", user.id)
      .single();

    if (combined?.role !== "seller") return redirectTo("/");

    // seller_profiles is a 1-1 relation; PostgREST returns it as an array.
    const sp = combined?.seller_profiles;
    const sellerStatus = (
      Array.isArray(sp) ? (sp as { status?: string }[])[0] : (sp as { status?: string } | null)
    )?.status;

    if (sellerStatus && sellerStatus !== "verified") {
      return redirectTo("/seller/onboarding");
    }
  }

  return supabaseResponse;
}
