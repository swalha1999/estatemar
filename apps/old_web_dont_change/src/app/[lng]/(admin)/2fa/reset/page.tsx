import { TwoFactorResetForm } from "./components";

import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/utils/auth/request";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="text-center text-destructive">Too many requests</p>;
    }

    const { session, user } = await getCurrentSession();
    if (session === null) {
        return redirect("/login");
    }
    if (!user.email_verified) {
        return redirect("/verify-email");
    }
    if (!user.registered_2fa) {
        return redirect("/2fa/setup");
    }
    if (session.two_factor_verified) {
        return redirect("/");
    }

    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Recover your account</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                <TwoFactorResetForm />
            </div>
        </div>
    );
}
