"use server";

import { RefillingTokenBucket } from "@/utils/auth/rate-limit";
import { globalPOSTRateLimit } from "@/utils/auth/request";
import { getCurrentSession, setSessionAs2FAVerified } from "@/utils/auth/session";
import { updateUserTOTPKey } from "@/utils/auth/user";
import { decodeBase64 } from "@oslojs/encoding";
import { verifyTOTP } from "@oslojs/otp";
import { redirect } from "next/navigation";

const totpUpdateBucket = new RefillingTokenBucket<number>(3, 60 * 10);

export async function setup2FAAction(
    _prev: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    if (!globalPOSTRateLimit()) {
        return {
            message: "Too many requests",
        };
    }
    const { session, user } = await getCurrentSession();
    if (session === null) {
        return {
            message: "Not authenticated",
        };
    }
    if (!user.email_verified) {
        return {
            message: "Forbidden",
        };
    }
    if (user.registered_2fa && !session.two_factor_verified) {
        return {
            message: "Forbidden",
        };
    }
    if (!totpUpdateBucket.check(user.id, 1)) {
        return {
            message: "Too many requests",
        };
    }

    const encodedKey = formData.get("key");
    const code = formData.get("code");
    if (typeof encodedKey !== "string" || typeof code !== "string") {
        return {
            message: "Invalid or missing fields",
        };
    }

    if (code === "") {
        return {
            message: "Please enter your code",
        };
    }

    if (encodedKey.length !== 28) {
        return {
            message: "Please enter your code",
        };
    }

    let key: Uint8Array;
    try {
        key = decodeBase64(encodedKey);
    } catch {
        return {
            message: "Invalid key",
        };
    }
    if (key.byteLength !== 20) {
        return {
            message: "Invalid key",
        };
    }
    if (!totpUpdateBucket.consume(user.id, 1)) {
        return {
            message: "Too many requests",
        };
    }
    if (!verifyTOTP(key, 30, 6, code)) {
        return {
            message: "Invalid code",
        };
    }
    await updateUserTOTPKey(session.userId, encodedKey);
    await setSessionAs2FAVerified(session.id);
    return redirect("/recovery-code");
}

interface ActionResult {
    message: string;
}
