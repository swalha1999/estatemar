import { PasswordResetRecoveryCodeForm, PasswordResetTOTPForm } from "./components";

import { validatePasswordResetSessionRequest } from "@/utils/auth/password-reset";
import { globalGETRateLimit } from "@/utils/auth/request";
import { redirect } from "next/navigation";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="text-center text-destructive">Too many requests</p>;
    }
    const { session, user } = await validatePasswordResetSessionRequest();

    if (session === null) {
        return redirect("/forgot-password");
    }
    if (!session.emailVerified) {
        return redirect("/reset-password/verify-email");
    }
    if (!user.registered_2fa) {
        return redirect("/reset-password");
    }
    if (session.twoFactorVerified) {
        return redirect("/reset-password");
    }
    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Two-factor authentication</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md space-y-6">
                <p className="text-center text-muted-foreground">
                    Enter the code from your authenticator app.
                </p>
                <PasswordResetTOTPForm />
                <div className="border-t border-border pt-4">
                    <h2 className="text-xl font-semibold mb-4">Use your recovery code instead</h2>
                    <PasswordResetRecoveryCodeForm />
                </div>
            </div>
        </div>
    );
}
