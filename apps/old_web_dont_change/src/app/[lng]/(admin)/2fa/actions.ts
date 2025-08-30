"use server";

import { totpBucket } from "@/utils/auth/2fa";
import { globalPOSTRateLimit } from "@/utils/auth/request";
import { getCurrentSession, setSessionAs2FAVerified } from "@/utils/auth/session";
import { getUserTOTPString } from "@/utils/auth/user";
import { verifyTOTP } from "@oslojs/otp";
import { redirect } from "next/navigation";
import { decodeBase64 } from "@oslojs/encoding";

export async function verify2FAAction(
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
    if (!user.email_verified || !user.registered_2fa || session.two_factor_verified) {
        return {
            message: "Forbidden",
        };
    }
    if (!totpBucket.check(user.id, 1)) {
        return {
            message: "Too many requests",
        };
    }

    const code = formData.get("code");
    if (typeof code !== "string") {
        return {
            message: "Invalid or missing fields",
        };
    }
    if (code === "") {
        return {
            message: "Enter your code",
        };
    }
    if (!totpBucket.consume(user.id, 1)) {
        return {
            message: "Too many requests",
        };
    }
    const totpString = await getUserTOTPString(user.id);
    if (totpString === null) {
        return {
            message: "Forbidden",
        };
    }
    if (!verifyTOTP(decodeBase64(totpString), 30, 6, code)) {
        return {
            message: "Invalid code",
        };
    }
    totpBucket.reset(user.id);
    await setSessionAs2FAVerified(session.id);
    return redirect("/");
}

interface ActionResult {
    message: string;
}
