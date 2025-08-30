import { cookies } from "next/headers";
// @ts-ignore TODO: remove this
import { cache } from "react";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { User, Session } from "@/db/schema";

export function getSessionCookieName(): string {
    return "session";
}

function daysToMilliseconds(days: number): number {
    return days * 1000 * 60 * 60 * 24;
}

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function createSession(
    token: string,
    userId: number,
    flags: SessionFlags
): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + daysToMilliseconds(30)),
        two_factor_verified: flags.twoFactorVerified,
    };
    await db.insert(sessions).values(session);
    return session;
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
    const token = (await cookies()).get(getSessionCookieName())?.value ?? null;
    if (token === null) {
        return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
});

export async function deleteSessionTokenCookie(): Promise<void> {
    (await cookies()).set(getSessionCookieName(), "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
    });
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
    (await cookies()).set(getSessionCookieName(), token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/",
    });
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId));
    if (result.length < 1) {
        return { session: null, user: null };
    }
    const { user, session } = result[0];
    if (Date.now() >= session.expiresAt.getTime()) {
        // delete the session if it's expired
        await db.delete(sessions).where(eq(sessions.id, session.id));
        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - daysToMilliseconds(15)) {
        // extend the session by 30 days if it's going to expire soon
        session.expiresAt = new Date(Date.now() + daysToMilliseconds(30));
        await db
            .update(sessions)
            .set({
                expiresAt: session.expiresAt,
            })
            .where(eq(sessions.id, session.id));
    }
    return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateUserSessions(userId: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function setSessionAs2FAVerified(sessionId: string): Promise<void> {
    await db.update(sessions).set({ two_factor_verified: true }).where(eq(sessions.id, sessionId));
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export interface SessionFlags {
    twoFactorVerified: boolean;
}
