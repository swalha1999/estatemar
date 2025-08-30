import { generateSessionToken, createSession, setSessionTokenCookie } from "@/utils/auth/session";
import { google } from "@/utils/auth/oauth";
import { cookies } from "next/headers";
import { createUserWithGoogleId, getUserFromGoogleId } from "@/utils/auth/user";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { globalGETRateLimit } from "@/utils/auth/request";

import { decodeIdToken, type OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
    if (!globalGETRateLimit()) {
        return new Response("Too many requests", {
            status: 429,
        });
    }
    const url = new URL(request.url);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = (await cookies()).get("google_oauth_state")?.value ?? null;
    const codeVerifier = (await cookies()).get("google_code_verifier")?.value ?? null;
    if (code === null || state === null || storedState === null || codeVerifier === null) {
        if (code === null) {
            console.error("code is null");
        }
        if (state === null) {
            console.error("state is null");
        }
        if (storedState === null) {
            console.error("storedState is null");
        }
        if (codeVerifier === null) {
            console.error("codeVerifier is null");
        }

        return new Response("Please restart the process.", {
            status: 400,
        });
    }
    if (state !== storedState) {
        console.error("the state does not match");
        return new Response("Please restart the process.", {
            status: 400,
        });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } catch {
        console.error("the code is invalid");
        return new Response("Please restart the process.", {
            status: 400,
        });
    }

    const claims = decodeIdToken(tokens.idToken());
    const claimsParser = new ObjectParser(claims);

    const googleId = claimsParser.getString("sub");
    const name = claimsParser.getString("name");
    const picture = claimsParser.getString("picture");
    const email = claimsParser.getString("email");

    const existingUser = await getUserFromGoogleId(googleId);
    if (existingUser !== null) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, existingUser.id, {
            twoFactorVerified: true,
        });
        setSessionTokenCookie(sessionToken, session.expiresAt);
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/dashboard`,
            },
        });
    }

    const user = await createUserWithGoogleId(googleId, email, name, picture);
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id, {
        twoFactorVerified: true,
    });
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
        status: 302,
        headers: {
            Location: `/dashboard`,
        },
    });
}
