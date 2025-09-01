import Link from "next/link";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/utils/auth/request";
import { getCurrentSession } from "@/utils/auth/session";
import { getUserRecoverCode } from "@/utils/auth/user";
import {
	RecoveryCodeSection,
	SendTestEmailButton,
	UpdateEmailForm,
	UpdatePasswordForm,
} from "./components";

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
		<div className="mx-auto max-w-2xl space-y-8">
			<h1 className="text-center font-bold text-3xl">Settings</h1>
			<div className="space-y-6 rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<section>
					<h2 className="mb-4 font-semibold text-2xl">Update email</h2>
					<p className="mb-2">Your email: {user.email}</p>
					<UpdateEmailForm />
				</section>
				<section>
					<h2 className="mb-4 font-semibold text-2xl">Update password</h2>
					<UpdatePasswordForm />
				</section>
				{user.registered_2fa && (
					<section>
						<h2 className="mb-4 font-semibold text-2xl">
							Two-factor authentication
						</h2>
						<Link href="/2fa/setup" className="text-primary hover:underline">
							Update 2FA settings
						</Link>
					</section>
				)}
				{recoveryCode !== null && (
					<RecoveryCodeSection recoveryCode={recoveryCode} />
				)}
				<SendTestEmailButton />
			</div>
		</div>
	);
}
