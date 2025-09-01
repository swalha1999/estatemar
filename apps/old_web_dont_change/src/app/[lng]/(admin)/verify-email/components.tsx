"use client";

import { useFormState } from "react-dom";
import {
	resendEmailVerificationCodeAction,
	verifyEmailAction,
} from "./actions";

const emailVerificationInitialState = {
	message: "",
};

export function EmailVerificationForm() {
	const [state, action] = useFormState(
		verifyEmailAction,
		emailVerificationInitialState,
	);
	return (
		<form action={action}>
			<label htmlFor="form-verify.code">Code</label>
			<input id="form-verify.code" name="code" required />
			<button>Verify</button>
			<p>{state.message}</p>
		</form>
	);
}

const resendEmailInitialState = {
	message: "",
};

export function ResendEmailVerificationCodeForm() {
	const [state, action] = useFormState(
		resendEmailVerificationCodeAction,
		resendEmailInitialState,
	);
	return (
		<form action={action}>
			<button>Resend code</button>
			<p>{state.message}</p>
		</form>
	);
}
