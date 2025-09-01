import { redirect } from "next/navigation";

import { validatePasswordResetSessionRequest } from "@/utils/auth/password-reset";
import { globalGETRateLimit } from "@/utils/auth/request";
import { PasswordResetEmailVerificationForm } from "./components";

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
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">
				Verify your email address
			</h1>
			<div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<p className="mb-4 text-center text-muted-foreground">
					We sent an 8-digit code to {session.email}.
				</p>
				<PasswordResetEmailVerificationForm />
			</div>
		</div>
	);
}
