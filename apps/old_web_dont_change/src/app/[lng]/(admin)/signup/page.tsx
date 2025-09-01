import Link from "next/link";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/utils/auth/request";
import { getCurrentSession } from "@/utils/auth/session";
import { SignUpForm } from "./components";

export default async function Page() {
	if (!globalGETRateLimit()) {
		return <p className="text-center text-destructive">Too many requests</p>;
	}
	const { session, user } = await getCurrentSession();
	if (session !== null) {
		if (!user.email_verified) {
			return redirect("/verify-email");
		}
		if (!user.registered_2fa) {
			return redirect("/2fa/setup");
		}
		if (!session.two_factor_verified) {
			return redirect("/2fa");
		}
		return redirect("/");
	}
	return (
		<div className="mx-auto max-w-md space-y-8">
			<div>
				<h1 className="text-center font-bold text-3xl">Create an account</h1>
			</div>
			<p className="text-center text-muted-foreground">
				Your username must be at least 3 characters long and your password must
				be at least 8 characters long.
			</p>
			<SignUpForm />
			<div className="text-center">
				<Link href="/login" className="text-primary hover:underline">
					Already have an account? Sign in
				</Link>
			</div>
		</div>
	);
}
