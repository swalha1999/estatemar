import Link from "next/link";
import { EmailVerificationForm, ResendEmailVerificationCodeForm } from "./components";

import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { getUserEmailVerificationRequestFromRequest } from "@/utils/auth/email-verification";
import { globalGETRateLimit } from "@/utils/auth/request";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="text-center text-destructive">Too many requests</p>;
    }
    const { user } = await getCurrentSession();
    if (user === null) {
        return redirect("/login");
    }

    const verificationRequest = await getUserEmailVerificationRequestFromRequest();
    if (verificationRequest === null && user.email_verified) {
        return redirect("/");
    }
    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Verify your email address</h1>
            <p className="text-center text-muted-foreground">
                We sent an 8-digit code to {verificationRequest?.email ?? user.email}.
            </p>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md space-y-6">
                <EmailVerificationForm />
                <ResendEmailVerificationCodeForm />
                <div className="text-center">
                    <Link href="/settings" className="text-primary hover:underline">
                        Change your email
                    </Link>
                </div>
            </div>
        </div>
    );
}
