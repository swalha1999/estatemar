import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/utils/auth/request";
import { getCurrentSession } from "@/utils/auth/session";
import { TwoFactorResetForm } from "./components";

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
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">Recover your account</h1>
			<div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<TwoFactorResetForm />
			</div>
		</div>
	);
}
