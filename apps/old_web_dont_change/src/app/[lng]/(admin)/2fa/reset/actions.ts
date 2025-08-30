"use server";

import { recoveryCodeBucket, resetUser2FAWithRecoveryCode } from "@/utils/auth/2fa";
import { getCurrentSession } from "@/utils/auth/session";

import { redirect } from "next/navigation";

export async function reset2FAAction(
    _prev: ActionResult,
    formData: FormData
): Promise<ActionResult> {
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

    if (!recoveryCodeBucket.check(user.id, 1)) {
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

    if (!recoveryCodeBucket.consume(user.id, 1)) {
        return {
            message: "Too many requests",
        };
    }

    const valid = await resetUser2FAWithRecoveryCode(user.id, code);
    if (!valid) {
        return {
            message: "Invalid recovery code",
        };
    }
    recoveryCodeBucket.reset(user.id);
    return redirect("/2fa/setup");
}

interface ActionResult {
    message: string;
}
