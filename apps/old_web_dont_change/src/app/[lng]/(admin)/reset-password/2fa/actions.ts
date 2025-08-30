"use server";

import { redirect } from "next/navigation";
import { decodeBase64 } from "@oslojs/encoding";
import { verifyTOTP } from "@oslojs/otp";

import { recoveryCodeBucket, resetUser2FAWithRecoveryCode, totpBucket } from "@/utils/auth/2fa";
import {
    setPasswordResetSessionAs2FAVerified,
    validatePasswordResetSessionRequest,
} from "@/utils/auth/password-reset";
import { globalPOSTRateLimit } from "@/utils/auth/request";
import { getUserTOTPString } from "@/utils/auth/user";

export async function verifyPasswordReset2FAWithTOTPAction(
    _prev: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    if (!globalPOSTRateLimit()) {
        return {
            message: "Too many requests",
        };
    }
    const { session, user } = await validatePasswordResetSessionRequest();
    if (session === null) {
        return {
            message: "Not authenticated",
        };
    }
    if (!session.emailVerified || !user.registered_2fa || session.twoFactorVerified) {
        return {
            message: "Forbidden",
        };
    }
    if (!totpBucket.check(session.userId, 1)) {
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
            message: "Please enter your code",
        };
    }
    const totpString = await getUserTOTPString(session.userId);
    if (totpString === null) {
        return {
            message: "Forbidden",
        };
    }
    if (!totpBucket.consume(session.userId, 1)) {
        return {
            message: "Too many requests",
        };
    }
    if (!verifyTOTP(decodeBase64(totpString), 30, 6, code)) {
        return {
            message: "Invalid code",
        };
    }
    totpBucket.reset(session.userId);
    setPasswordResetSessionAs2FAVerified(session.id);
    return redirect("/reset-password");
}

export async function verifyPasswordReset2FAWithRecoveryCodeAction(
    _prev: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    if (!globalPOSTRateLimit()) {
        return {
            message: "Too many requests",
        };
    }
    const { session, user } = await validatePasswordResetSessionRequest();
    if (session === null) {
        return {
            message: "Not authenticated",
        };
    }
    if (!session.emailVerified || !user.registered_2fa || session.twoFactorVerified) {
        return {
            message: "Forbidden",
        };
    }

    if (!recoveryCodeBucket.check(session.userId, 1)) {
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
            message: "Please enter your code",
        };
    }
    if (!recoveryCodeBucket.consume(session.userId, 1)) {
        return {
            message: "Too many requests",
        };
    }
    const valid = resetUser2FAWithRecoveryCode(session.userId, code);
    if (!valid) {
        return {
            message: "Invalid code",
        };
    }
    recoveryCodeBucket.reset(session.userId);
    return redirect("/reset-password");
}

interface ActionResult {
    message: string;
}
