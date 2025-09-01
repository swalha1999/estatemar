import { redirect } from "next/navigation";

import { validatePasswordResetSessionRequest } from "@/utils/auth/password-reset";
import { globalGETRateLimit } from "@/utils/auth/request";
import { PasswordResetForm } from "./components";

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
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">
				Enter your new password
			</h1>
			<div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<PasswordResetForm />
			</div>
		</div>
	);
}
