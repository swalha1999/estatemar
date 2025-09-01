import type * as React from "react";
import { Resend } from "resend";
import { EmailTestTemplate } from "@/components/email-templates/email-test-template";
import { EmailVerificationTemplate } from "@/components/email-templates/email-verification-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
	to: string,
	subject: string,
	react: React.ReactElement,
): Promise<{ data: any; error: any }> {
	try {
		const { data, error } = await resend.emails.send({
			from: "Estatemar <no-reply@estatemar.com>",
			to: [to],
			subject: subject,
			react: react,
		});
		return { data, error };
	} catch (error) {
		return { data: null, error: error };
	}
}

export async function sendEmailVerificationCode(
	to: string,
	name: string,
	code: string,
) {
	return sendEmail(
		to,
		"Email Verification Code",
		EmailVerificationTemplate({
			firstName: name,
			verificationCode: code,
		}) as React.ReactElement,
	);
}

export async function sendTestEmail(to: string, name: string, message: string) {
	return sendEmail(
		to,
		"Test Email",
		EmailTestTemplate({
			recipientName: name,
			testMessage: message,
		}) as React.ReactElement,
	);
}
