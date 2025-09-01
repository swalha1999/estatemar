"use client";

import { useFormState } from "react-dom";
import { setup2FAAction } from "./actions";

const initial2FASetUpState = {
	message: "",
};

export function TwoFactorSetUpForm(props: { encodedTOTPKey: string }) {
	const [state, action] = useFormState(setup2FAAction, initial2FASetUpState);
	return (
		<form action={action}>
			<input name="key" defaultValue={props.encodedTOTPKey} hidden required />
			<label htmlFor="form-totp.code">Verify the code from the app</label>
			<input id="form-totp.code" name="code" required />
			<br />
			<button>Save</button>
			<p>{state.message}</p>
		</form>
	);
}
