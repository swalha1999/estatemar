import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserEmailVerificationRequestFromRequest } from "@/utils/auth/email-verification";
import { globalGETRateLimit } from "@/utils/auth/request";
import { getCurrentSession } from "@/utils/auth/session";
import {
	EmailVerificationForm,
	ResendEmailVerificationCodeForm,
} from "./components";

export default async function Page() {
	if (!globalGETRateLimit()) {
		return <p className="text-center text-destructive">Too many requests</p>;
	}
	const { user } = await getCurrentSession();
	if (user === null) {
		return redirect("/login");
	}

	const verificationRequest =
		await getUserEmailVerificationRequestFromRequest();
	if (verificationRequest === null && user.email_verified) {
		return redirect("/");
	}
	return (
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">
				Verify your email address
			</h1>
			<p className="text-center text-muted-foreground">
				We sent an 8-digit code to {verificationRequest?.email ?? user.email}.
			</p>
			<div className="space-y-6 rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<EmailVerificationForm />
				<ResendEmailVerificationCodeForm />
				<div className="text-center">
					<Link href="/settings" className="text-primary hover:underline">
						Change your email
					</Link>
				</div>
			</div>
		</div>
	);
}
