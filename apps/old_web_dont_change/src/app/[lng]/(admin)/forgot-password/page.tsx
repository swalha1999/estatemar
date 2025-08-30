import { ForgotPasswordForm } from "./components";
import Link from "next/link";

import { globalGETRateLimit } from "@/utils/auth/request";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="text-center text-destructive">Too many requests</p>;
    }
    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Forgot your password?</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                <ForgotPasswordForm />
                <div className="mt-4 text-center">
                    <Link href="/login" className="text-primary hover:underline">
                        Back to Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
