import { PasswordResetEmailVerificationForm } from "./components";

import { validatePasswordResetSessionRequest } from "@/utils/auth/password-reset";
import { globalGETRateLimit } from "@/utils/auth/request";
import { redirect } from "next/navigation";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="text-center text-destructive">Too many requests</p>;
    }
    const { session } = await validatePasswordResetSessionRequest();
    if (session === null) {
        return redirect("/forgot-password");
    }
    if (session.emailVerified) {
        if (!session.twoFactorVerified) {
            return redirect("/reset-password/2fa");
        }
        return redirect("/reset-password");
    }
    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Verify your email address</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                <p className="mb-4 text-center text-muted-foreground">
                    We sent an 8-digit code to {session.email}.
                </p>
                <PasswordResetEmailVerificationForm />
            </div>
        </div>
    );
}
