import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    // 1. CRITICAL: Bypass Next.js Server Actions immediately!
    // Next.js Server Actions expect a specific, un-redirected raw stream (RSC).
    const isServerAction = request.method === "POST" && request.headers.get("next-action") !== null;

    if (isServerAction) {
        return NextResponse.next({ request });
    }

    const supabaseResponse = NextResponse.next({ request });

    const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"]!;
    const supabaseKey = process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]!;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet, headers) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

                // supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));

                Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
            },
        },
    });

    const { data } = await supabase.auth.getClaims();

    const user = data?.claims;

    const pathname = request.nextUrl.pathname;

    if (!user && !pathname.startsWith("/sign-in") && !pathname.startsWith("/sign-up")) {
        const url = request.nextUrl.clone();
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    if (user && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
