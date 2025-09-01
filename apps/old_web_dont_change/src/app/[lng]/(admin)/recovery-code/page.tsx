import Link from "next/link";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/utils/auth/request";
import { getCurrentSession } from "@/utils/auth/session";
import { getUserRecoverCode } from "@/utils/auth/user";

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
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">Recovery code</h1>
			<div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<p className="mb-4">Your recovery code is:</p>
				<p className="mb-6 text-center font-mono text-2xl">{recoveryCode}</p>
				<p className="mb-6 text-muted-foreground text-sm">
					You can use this recovery code if you lose access to your second
					factors.
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
