import { redirect } from "next/navigation";

import { validatePasswordResetSessionRequest } from "@/utils/auth/password-reset";
import { globalGETRateLimit } from "@/utils/auth/request";
import {
	PasswordResetRecoveryCodeForm,
	PasswordResetTOTPForm,
} from "./components";

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
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">
				Two-factor authentication
			</h1>
			<div className="space-y-6 rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<p className="text-center text-muted-foreground">
					Enter the code from your authenticator app.
				</p>
				<PasswordResetTOTPForm />
				<div className="border-border border-t pt-4">
					<h2 className="mb-4 font-semibold text-xl">
						Use your recovery code instead
					</h2>
					<PasswordResetRecoveryCodeForm />
				</div>
			</div>
		</div>
	);
}
