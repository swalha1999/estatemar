import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/utils/auth/oauth";
import { cookies } from "next/headers";
import { globalGETRateLimit } from "@/utils/auth/request";

export async function GET(): Promise<Response> {
    if (!globalGETRateLimit()) {
        return new Response("Too many requests", {
            status: 429,
        });
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

    (await cookies()).set("google_oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    });
    (await cookies()).set("google_code_verifier", codeVerifier, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    });
}
