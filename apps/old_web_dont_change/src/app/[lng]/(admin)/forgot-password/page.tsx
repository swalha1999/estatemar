import Link from "next/link";
import { globalGETRateLimit } from "@/utils/auth/request";
import { ForgotPasswordForm } from "./components";

export default async function Page() {
	if (!globalGETRateLimit()) {
		return <p className="text-center text-destructive">Too many requests</p>;
	}
	return (
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">Forgot your password?</h1>
			<div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
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
