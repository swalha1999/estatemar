"use client";

import { useFormState } from "react-dom";
import { reset2FAAction } from "./actions";

const initial2FAResetState = {
	message: "",
};

export function TwoFactorResetForm() {
	const [state, action] = useFormState(reset2FAAction, initial2FAResetState);
	return (
		<form action={action}>
			<label htmlFor="form-totp.code">Recovery code</label>
			<input id="form-totp.code" name="code" required />
			<br />
			<button>Verify</button>
			<p>{state.message ?? ""}</p>
		</form>
	);
}
