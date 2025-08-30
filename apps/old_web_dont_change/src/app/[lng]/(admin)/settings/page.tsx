import Link from "next/link";

import {
    RecoveryCodeSection,
    SendTestEmailButton,
    UpdateEmailForm,
    UpdatePasswordForm,
} from "./components";
import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { getUserRecoverCode } from "@/utils/auth/user";
import { globalGETRateLimit } from "@/utils/auth/request";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="text-center text-destructive">Too many requests</p>;
    }
    const { session, user } = await getCurrentSession();
    if (session === null) {
        return redirect("/login");
    }
    if (user.registered_2fa && !session.two_factor_verified) {
        return redirect("/2fa");
    }
    let recoveryCode: string | null = null;
    if (user.registered_2fa) {
        recoveryCode = await getUserRecoverCode(user.id);
    }
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Settings</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Update email</h2>
                    <p className="mb-2">Your email: {user.email}</p>
                    <UpdateEmailForm />
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Update password</h2>
                    <UpdatePasswordForm />
                </section>
                {user.registered_2fa && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Two-factor authentication</h2>
                        <Link href="/2fa/setup" className="text-primary hover:underline">
                            Update 2FA settings
                        </Link>
                    </section>
                )}
                {recoveryCode !== null && <RecoveryCodeSection recoveryCode={recoveryCode} />}
                <SendTestEmailButton />
            </div>
        </div>
    );
}
