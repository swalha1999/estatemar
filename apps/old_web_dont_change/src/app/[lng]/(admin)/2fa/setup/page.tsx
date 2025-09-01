import { encodeBase64 } from "@oslojs/encoding";
import { createTOTPKeyURI } from "@oslojs/otp";
import { redirect } from "next/navigation";
import { renderSVG } from "uqr";
import { globalGETRateLimit } from "@/utils/auth/request";
import { getCurrentSession } from "@/utils/auth/session";
import { TwoFactorSetUpForm } from "./components";

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
	if (user.registered_2fa && !session.two_factor_verified) {
		return redirect("/2fa");
	}

	const totpKey = new Uint8Array(20);
	crypto.getRandomValues(totpKey);
	const encodedTOTPKey = encodeBase64(totpKey);
	const keyURI = createTOTPKeyURI("Demo", user.username, totpKey, 30, 6);
	const qrcode = renderSVG(keyURI);
	return (
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">
				Set up two-factor authentication
			</h1>
			<div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
				<div
					className="mx-auto mb-6 h-48 w-48"
					dangerouslySetInnerHTML={{
						__html: qrcode,
					}}
				/>
				<TwoFactorSetUpForm encodedTOTPKey={encodedTOTPKey} />
			</div>
		</div>
	);
}
