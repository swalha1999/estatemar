import { PasswordResetForm } from "./components";

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
    if (user.registered_2fa && !session.twoFactorVerified) {
        return redirect("/reset-password/2fa");
    }
    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Enter your new password</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                <PasswordResetForm />
            </div>
        </div>
    );
}
