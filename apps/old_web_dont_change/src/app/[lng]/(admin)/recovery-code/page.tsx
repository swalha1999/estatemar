import Link from "next/link";

import { getCurrentSession } from "@/utils/auth/session";
import { getUserRecoverCode } from "@/utils/auth/user";
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
    if (!session.two_factor_verified) {
        return redirect("/2fa");
    }
    const recoveryCode = await getUserRecoverCode(user.id);
    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Recovery code</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                <p className="mb-4">Your recovery code is:</p>
                <p className="text-2xl font-mono text-center mb-6">{recoveryCode}</p>
                <p className="text-sm text-muted-foreground mb-6">
                    You can use this recovery code if you lose access to your second factors.
                </p>
                <div className="text-center">
                    <Link href="/" className="text-primary hover:underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
